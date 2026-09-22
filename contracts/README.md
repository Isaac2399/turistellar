# Soroban contracts (Rust)

This folder is reserved for Stellar smart contracts (escrow, marketplace, payouts).

Suggested layout once contracts are scaffolded with the Stellar CLI:

```
contracts/
  escrow/
    src/lib.rs
    Cargo.toml
  marketplace/
    src/lib.rs
    Cargo.toml
```

Initialize a contract with:

```bash
stellar contract init contracts/escrow
```
