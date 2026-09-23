use super::*;
use soroban_sdk::{
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    token::{StellarAssetClient, TokenClient},
    Address, ConversionError, Env, IntoVal, InvokeError, String,
};

const AMOUNT: i128 = 10_000_000;
const FUNDS: i128 = 50_000_000;

struct Parties {
    tourist: Address,
    merchant: Address,
    intruder: Address,
    asset: Address,
}

fn parties(env: &Env) -> Parties {
    let tourist = Address::generate(env);
    let merchant = Address::generate(env);
    let intruder = Address::generate(env);
    let issuer = Address::generate(env);
    let sac = env.register_stellar_asset_contract_v2(issuer);
    let asset = sac.address();
    StellarAssetClient::new(env, &asset).mint(&tourist, &FUNDS);
    Parties {
        tourist,
        merchant,
        intruder,
        asset,
    }
}

fn contract(env: &Env) -> EscrowContractClient<'_> {
    let id = env.register(EscrowContract, ());
    EscrowContractClient::new(env, &id)
}

fn booking(env: &Env, id: &str) -> String {
    String::from_str(env, id)
}

fn open_booking<'a>(env: &'a Env, id: &str) -> (EscrowContractClient<'a>, Parties, String) {
    let parties = parties(env);
    let client = contract(env);
    let booking_id = booking(env, id);
    client.open(
        &booking_id,
        &parties.tourist,
        &parties.merchant,
        &AMOUNT,
        &parties.asset,
    );
    (client, parties, booking_id)
}

fn authorized(env: &Env, who: &Address) -> bool {
    env.auths().iter().any(|(addr, _)| addr == who)
}

fn assert_invalid_status(
    result: Result<Result<(), ConversionError>, Result<Error, InvokeError>>,
) {
    assert_eq!(result, Err(Ok(Error::InvalidStatus)));
}

#[test]
fn happy_path_releases_to_merchant() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, parties, id) = open_booking(&env, "booking-happy");
    let token = TokenClient::new(&env, &parties.asset);

    assert!(authorized(&env, &parties.tourist));
    assert_eq!(client.get(&id).status, Status::Open);
    assert_eq!(token.balance(&client.address), 0);

    client.deposit(&id);
    assert!(authorized(&env, &parties.tourist));
    assert_eq!(client.get(&id).status, Status::DepositHeld);
    assert_eq!(token.balance(&client.address), AMOUNT);
    assert_eq!(token.balance(&parties.tourist), FUNDS - AMOUNT);
    assert_eq!(token.balance(&parties.merchant), 0);

    client.confirm_service(&id);
    assert!(authorized(&env, &parties.merchant));
    assert_eq!(client.get(&id).status, Status::ServiceConfirmed);
    assert_eq!(token.balance(&client.address), AMOUNT);
    assert_eq!(token.balance(&parties.merchant), 0);

    client.release(&id);
    assert!(authorized(&env, &parties.merchant));
    assert_eq!(client.get(&id).status, Status::FundsReleased);
    assert_eq!(token.balance(&client.address), 0);
    assert_eq!(token.balance(&parties.merchant), AMOUNT);
    assert_eq!(token.balance(&parties.tourist), FUNDS - AMOUNT);
}

#[test]
fn refund_from_deposit_held() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, parties, id) = open_booking(&env, "booking-refund");
    let token = TokenClient::new(&env, &parties.asset);

    client.deposit(&id);
    client.refund(&id);

    assert!(authorized(&env, &parties.tourist));
    assert_eq!(client.get(&id).status, Status::Refunded);
    assert_eq!(token.balance(&client.address), 0);
    assert_eq!(token.balance(&parties.tourist), FUNDS);
    assert_eq!(token.balance(&parties.merchant), 0);
    assert_invalid_status(client.try_release(&id));
    assert_eq!(token.balance(&parties.merchant), 0);
}

#[test]
fn release_without_confirm_fails() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, parties, id) = open_booking(&env, "booking-unconfirmed");
    let token = TokenClient::new(&env, &parties.asset);

    client.deposit(&id);
    assert_invalid_status(client.try_release(&id));

    assert_eq!(client.get(&id).status, Status::DepositHeld);
    assert_eq!(token.balance(&client.address), AMOUNT);
    assert_eq!(token.balance(&parties.merchant), 0);
    assert_eq!(token.balance(&parties.tourist), FUNDS - AMOUNT);
}

#[test]
fn refund_after_confirm_fails() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, parties, id) = open_booking(&env, "booking-already-confirmed");
    let token = TokenClient::new(&env, &parties.asset);

    client.deposit(&id);
    client.confirm_service(&id);
    assert_invalid_status(client.try_refund(&id));

    assert_eq!(client.get(&id).status, Status::ServiceConfirmed);
    assert_eq!(token.balance(&client.address), AMOUNT);
    assert_eq!(token.balance(&parties.tourist), FUNDS - AMOUNT);

    client.release(&id);
    assert_eq!(client.get(&id).status, Status::FundsReleased);
    assert_eq!(token.balance(&parties.merchant), AMOUNT);
    assert_eq!(token.balance(&client.address), 0);
}

#[test]
fn deposit_by_non_tourist() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, parties, id) = open_booking(&env, "booking-intruder");
    let token = TokenClient::new(&env, &parties.asset);

    env.mock_auths(&[MockAuth {
        address: &parties.intruder,
        invoke: &MockAuthInvoke {
            contract: &client.address,
            fn_name: "deposit",
            args: (id.clone(),).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    assert!(client.try_deposit(&id).is_err());
    assert_eq!(client.get(&id).status, Status::Open);
    assert_eq!(token.balance(&client.address), 0);
    assert_eq!(token.balance(&parties.tourist), FUNDS);
    assert_eq!(token.balance(&parties.merchant), 0);
}

#[test]
fn confirm_without_deposit_fails() {
    let env = Env::default();
    env.mock_all_auths();
    let (client, parties, id) = open_booking(&env, "booking-no-deposit");
    let token = TokenClient::new(&env, &parties.asset);

    assert_invalid_status(client.try_confirm_service(&id));
    assert_eq!(client.get(&id).status, Status::Open);
    assert_eq!(token.balance(&client.address), 0);
}
