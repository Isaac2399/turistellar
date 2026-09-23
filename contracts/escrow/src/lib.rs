#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, token, Address, Env, String,
};

/// One contract, many bookings. The app stores this contract id once and the
/// `booking_id` of each deposit.
const MAX_BOOKING_ID_LEN: u32 = 128;
const LEDGERS_PER_DAY: u32 = 17_280;
const TTL_THRESHOLD: u32 = 30 * LEDGERS_PER_DAY;
const TTL_EXTEND_TO: u32 = 180 * LEDGERS_PER_DAY;

/// `Open` is the record created before the tourist deposits.
/// From `DepositHeld` on, the cycle matches the app.
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Status {
    Open = 0,
    DepositHeld = 1,
    ServiceConfirmed = 2,
    FundsReleased = 3,
    Refunded = 4,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Escrow {
    pub booking_id: String,
    pub tourist: Address,
    pub merchant: Address,
    pub amount: i128,
    pub asset: Address,
    pub status: Status,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
    Escrow(String),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    InvalidBooking = 1,
    BookingExists = 2,
    BookingMissing = 3,
    InvalidAmount = 4,
    SameParties = 5,
    InvalidStatus = 6,
    IncompleteTransfer = 7,
}

#[contractevent]
pub struct EscrowUpdated {
    #[topic]
    pub booking_id: String,
    pub status: Status,
    pub amount: i128,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Fixes tourist, merchant, amount, SAC asset, and booking id.
    /// Requires the tourist's signature. Does not move funds.
    pub fn open(
        env: Env,
        booking_id: String,
        tourist: Address,
        merchant: Address,
        amount: i128,
        asset: Address,
    ) -> Result<(), Error> {
        validate_open(&booking_id, &tourist, &merchant, amount)?;
        if env.storage().persistent().has(&storage_key(&booking_id)) {
            return Err(Error::BookingExists);
        }
        tourist.require_auth();

        let escrow = Escrow {
            booking_id,
            tourist,
            merchant,
            amount,
            asset,
            status: Status::Open,
        };
        publish(&env, &escrow);
        Ok(())
    }

    /// The tourist deposits the agreed amount. Moves to `DepositHeld`.
    pub fn deposit(env: Env, booking_id: String) -> Result<(), Error> {
        let mut escrow = read(&env, &booking_id)?;
        require_status(escrow.status, Status::Open)?;
        escrow.tourist.require_auth();
        transfer_exact(
            &env,
            &escrow.asset,
            &escrow.tourist,
            &env.current_contract_address(),
            escrow.amount,
        )?;
        escrow.status = Status::DepositHeld;
        publish(&env, &escrow);
        Ok(())
    }

    /// The merchant confirms the service was delivered. Does not move funds.
    pub fn confirm_service(env: Env, booking_id: String) -> Result<(), Error> {
        let mut escrow = read(&env, &booking_id)?;
        require_status(escrow.status, Status::DepositHeld)?;
        escrow.merchant.require_auth();
        escrow.status = Status::ServiceConfirmed;
        publish(&env, &escrow);
        Ok(())
    }

    /// The merchant withdraws the deposit. Only after confirmation.
    pub fn release(env: Env, booking_id: String) -> Result<(), Error> {
        let mut escrow = read(&env, &booking_id)?;
        require_status(escrow.status, Status::ServiceConfirmed)?;
        escrow.merchant.require_auth();
        transfer_exact(
            &env,
            &escrow.asset,
            &env.current_contract_address(),
            &escrow.merchant,
            escrow.amount,
        )?;
        escrow.status = Status::FundsReleased;
        publish(&env, &escrow);
        Ok(())
    }

    /// The tourist recovers the deposit. Only from `DepositHeld`.
    pub fn refund(env: Env, booking_id: String) -> Result<(), Error> {
        let mut escrow = read(&env, &booking_id)?;
        require_status(escrow.status, Status::DepositHeld)?;
        escrow.tourist.require_auth();
        transfer_exact(
            &env,
            &escrow.asset,
            &env.current_contract_address(),
            &escrow.tourist,
            escrow.amount,
        )?;
        escrow.status = Status::Refunded;
        publish(&env, &escrow);
        Ok(())
    }

    pub fn get(env: Env, booking_id: String) -> Result<Escrow, Error> {
        read(&env, &booking_id)
    }
}

fn validate_open(
    booking_id: &String,
    tourist: &Address,
    merchant: &Address,
    amount: i128,
) -> Result<(), Error> {
    if booking_id.is_empty() || booking_id.len() > MAX_BOOKING_ID_LEN {
        return Err(Error::InvalidBooking);
    }
    if amount <= 0 {
        return Err(Error::InvalidAmount);
    }
    if tourist == merchant {
        return Err(Error::SameParties);
    }
    Ok(())
}

fn require_status(actual: Status, expected: Status) -> Result<(), Error> {
    if actual == expected {
        Ok(())
    } else {
        Err(Error::InvalidStatus)
    }
}

fn storage_key(booking_id: &String) -> DataKey {
    DataKey::Escrow(booking_id.clone())
}

fn read(env: &Env, booking_id: &String) -> Result<Escrow, Error> {
    env.storage()
        .persistent()
        .get(&storage_key(booking_id))
        .ok_or(Error::BookingMissing)
}

fn publish(env: &Env, escrow: &Escrow) {
    let key = storage_key(&escrow.booking_id);
    env.storage().persistent().set(&key, escrow);
    env.storage()
        .persistent()
        .extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND_TO);
    EscrowUpdated {
        booking_id: escrow.booking_id.clone(),
        status: escrow.status,
        amount: escrow.amount,
    }
    .publish(env);
}

/// Moves the exact amount. If the asset does not credit that net, the transaction reverts.
fn transfer_exact(
    env: &Env,
    asset: &Address,
    from: &Address,
    to: &Address,
    amount: i128,
) -> Result<(), Error> {
    let token = token::TokenClient::new(env, asset);
    let before = token.balance(to);
    token.transfer(from, to.clone(), &amount);
    let net = token.balance(to).checked_sub(before);
    if net == Some(amount) {
        Ok(())
    } else {
        Err(Error::IncompleteTransfer)
    }
}

#[cfg(test)]
mod test;
