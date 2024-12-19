mod IMarquisCore;
mod MarquisCore;
mod games {
    pub mod Ludo;
}
mod components {
    pub mod MarquisGame;
}
mod interfaces {
    pub mod ILudo;
    pub mod IMarquisGame;
}
#[cfg(test)]
mod test {
    mod TestContract;
    mod mock {
        mod ERC20;
    }
}

