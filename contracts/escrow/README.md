# Deposit escrow

One Soroban contract for Stellar testnet. Each booking is its own entry, identified by `booking_id` (a string of 1 to 128 bytes). The frontend stores that id together with the deployed contract id.

There is no admin and no function that drains the contract. Anyone who is not the tourist or the merchant of that booking cannot move the deposit. An extra token transfer into the contract cannot be recovered: only the amount fixed at open is moved.

The asset is the Stellar Asset Contract (SAC) address. Native XLM and a classic asset (for example USDC) are used that way, not with the issuer account `G...`.

## Status

| Status | When |
| --- | --- |
| `Open` | Parties, amount, and asset are fixed. No deposit yet. |
| `DepositHeld` | The tourist deposited the amount. The merchant cannot withdraw it. |
| `ServiceConfirmed` | The merchant confirmed the service. The deposit stays in the contract. |
| `FundsReleased` | The merchant withdrew the deposit to their account. |
| `Refunded` | The tourist recovered the deposit. This is reachable only from `DepositHeld`. |

The app uses the last four. `Open` exists only between `open` and `deposit`.

## Functions

Any account can submit the transaction. The signature the contract requires is the one in the Signer column.

| Function | Signer | Effect |
| --- | --- | --- |
| `open(booking_id, tourist, merchant, amount, asset)` | tourist | Creates the booking in `Open`. `amount` is in the asset's smallest units (7 decimals for XLM: 1 XLM = 10000000). |
| `deposit(booking_id)` | tourist | Transfers the agreed amount and moves to `DepositHeld`. |
| `confirm_service(booking_id)` | merchant | Only from `DepositHeld`. Does not move funds. |
| `release(booking_id)` | merchant | Only from `ServiceConfirmed`. Credits the amount to the merchant. |
| `refund(booking_id)` | tourist | Only from `DepositHeld`. Returns the amount to the tourist. |
| `get(booking_id)` | nobody | Reads the parties, amount, asset, and status. |

`lib/soroban.ts` already reads the contract id. This README does not wire checkout.

The contract previously deployed at `CD4IXEHZYS6YQ6LQ7H5NC4MPCCV6WDSAOM7AJFG5R3UYPDS4LX54DMWD` uses the old Spanish entry points (`iniciar`, `depositar`, `confirmar_servicio`, `liberar`, `reembolsar`, `obtener`). This source no longer matches that deployment. Build and deploy again, then replace `NEXT_PUBLIC_SOROBAN_ESCROW_CONTRACT_ID`.

## Test locally

Rust 1.84 or newer is required: <https://rustup.rs>.

On this machine the MSVC linker is missing, so use the GNU toolchain:

```powershell
cd contracts/escrow
$env:RUSTUP_TOOLCHAIN = "stable-x86_64-pc-windows-gnu"
cargo test
```

The tests do not use testnet or keys. They cover the cycle through `FundsReleased`, a refund from `DepositHeld`, release without confirmation, refund after confirmation, a deposit signed by another account, and confirmation without a deposit.

## Build

`lto` is off in `Cargo.toml`. With the Windows GNU toolchain, link-time optimization makes rustc fail to load the `bytes_lit` proc-macro.

```powershell
cd contracts/escrow
$env:RUSTUP_TOOLCHAIN = "stable-x86_64-pc-windows-gnu"
rustup target add wasm32v1-none
stellar contract build
```

The Wasm is written to `target/wasm32v1-none/release/escrow.wasm`.

If PowerShell does not recognize `stellar`, the CLI is installed at `C:\Program Files (x86)\Stellar CLI`. Add it for the current window:

```powershell
$env:Path += ";C:\Program Files (x86)\Stellar CLI"
```

## Deploy to testnet

Install Stellar CLI 28, the same protocol line as `soroban-sdk` 28.0.0:

```powershell
winget install --id Stellar.StellarCLI
```

Other platforms: <https://developers.stellar.org/docs/tools/cli/install-cli>.

Create a local identity and fund it with Friendbot. The secret stays in the CLI store on your machine. Do not copy it into the repo, `.env.local`, or chat.

```powershell
stellar keys generate deployer --network testnet --fund
```

If the name `deployer` already exists, pick another. You do not need to paste the public key into this file.

Deploy the Wasm. The command prints the contract id (`C...`). There are no constructor arguments.

```powershell
stellar contract deploy --wasm target/wasm32v1-none/release/escrow.wasm --source-account deployer --network testnet
```

Copy that id into `.env.local` (do not commit it):

```
NEXT_PUBLIC_SOROBAN_ESCROW_CONTRACT_ID=C...
```

`lib/soroban.ts` exposes it as `soroban.escrowContractId`. Restart `npm run dev` after changing the variable. Checkout still does not call the contract.

For a manual invoke, the testnet XLM asset is the native SAC:

```powershell
stellar contract id asset --asset native --network testnet
```

For a classic asset, substitute the code and the public issuer (that is not a secret either):

```powershell
stellar contract id asset --asset USDC:G...ISSUER --network testnet
```

Open a booking with `G...` accounts that already exist on testnet and the SAC from above. `AMOUNT` is in smallest units. The `--source-account` must be the signer.

```powershell
stellar contract invoke --id C...CONTRACT_ID --source-account turista --network testnet -- open --booking_id booking-1 --tourist G...TOURIST --merchant G...MERCHANT --amount 10000000 --asset C...SAC
stellar contract invoke --id C...CONTRACT_ID --source-account turista --network testnet -- deposit --booking_id booking-1
stellar contract invoke --id C...CONTRACT_ID --source-account merchant --network testnet -- confirm_service --booking_id booking-1
stellar contract invoke --id C...CONTRACT_ID --source-account merchant --network testnet -- release --booking_id booking-1
stellar contract invoke --id C...CONTRACT_ID --source-account turista --network testnet -- get --booking_id booking-1
```

`refund` and `release` are exclusive: a refund is valid only in `DepositHeld`, and release is valid only after `confirm_service`.

```powershell
stellar contract invoke --id C...CONTRACT_ID --source-account turista --network testnet -- refund --booking_id booking-2
```
