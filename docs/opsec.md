# Contributor Operations Security

## General Tips

1. **Think before you click.** Most cyber-attacks start with phishing or social engineering. Exercise caution when clicking links or downloading files. Tend towards being overly cautious, and don't hestitate to ask others for help.
2. **Secure your accounts.** Use multi-factor authentication and an offline password manager like [KeePassXC](https://keepassxc.org/).
3. **Simulate transactions.** Before approving any transactions, use a tool like [Tenderly](https://tenderly.co/) to verify its outcome. Only interact with trusted frontends and contracts.
4. **Minimize dependencies.** The best software is no software. If you have to, look for tools that respects user privacy, and are open-source, audited, and well-established.
5. **Stay up to date.** Always ensure that you have the latest security upgrades. Use automatic updates.

## Prevention Checklist

If you haven't already, take the following steps over the next 2 weeks. If you have any questions, ask filipv.

- [ ] Familiarize yourself with the [Emergency Process](../emergency).
- [ ] Set up automatic updates for all relevant software (browsers, apps, clients, etc).
- [ ] Join the [Backup Telegram](https://t.me/jbx_backup).
- [ ] Buy a [YubiKey](https://www.yubico.com/), or a similar 2FA hardware device.
- [ ] Set up an offline password manager like [KeePassXC](https://keepassxc.org/).
- [ ] If you haven't already, create a new email for work related to Juicebox.
- [ ] Migrate online accounts related to Juicebox to your new email. Use the password manager to generate new passwords as you do this, with >128 bits of entropy.
- [ ] Set up Two-Factor authentication for all of your Juicebox accounts
- [ ] Buy and use a hardware wallet — a [Ledger](https://www.ledger.com/) or a [Trezor](https://trezor.io/).
- [ ] Regularly run antivirus software. For Windows users, Windows Defender and [MalwareBytes](https://www.malwarebytes.com/) are both decent free options.
- [ ] Check your email and phone number on [haveibeenpwned](https://haveibeenpwned.com/), and update credentials for any accounts which appear.

## Intervention Checklist

If you suspect that any of your accounts may be compromised, take the following steps as quickly as possible:

- [ ] If you suspect that you may have malware, or if you're not sure how your account was compromised: Update your security software, run a scan, and delete any malware. Use a second device for the following steps while this runs.
- [ ] Take immediate action to minimize damage. If you are able to log in to the compromised account, change the password immediately. If you don't already have 2FA on the account, add it. Deactivate any API keys or other integrations associated with that account.
- [ ] Warn other contributors over Discord and Telegram. Write a brief message detailing the name of the compromised account/service and how the compromise took place. If the compromised account has any administrative permissions, be sure to contact contributors who can remove those permissions (or remove the account entirely).
- [ ] If applicable, contact the relevant service's customer support. You should also ask other contributors if they have a contact which can help to resolve the issue more quickly. Start with the resources below:

| Service  | Link                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------- |
| Discord  | [Support](https://support.discord.com/hc/en-us/requests/new) (select `Hacked Account`)                |
| GitHub   | [GitHub Authentication Docs](https://docs.github.com/en/authentication)                               |
| Twitter  | [Help with my hacked account](https://help.twitter.com/en/safety-and-security/twitter-account-hacked) |
| Google   | [Secure a hacked or compromised Google Account](https://support.google.com/accounts/answer/6294825)   |
| Telegram | [FAQ](https://telegram.org/faq#q-my-phone-was-stolen-what-do-i-do)                                    |
| Notion   | Scroll to bottom, click ['Contact Support'](https://www.notion.so/product)                            |

## Multisig Checklist

If you are a multisig signer, take the following steps over the next 2 weeks:

- [ ] Familiarize yourself with the [Emergency Process](emergency).
- [ ] Buy and use a hardware wallet — a [Ledger](https://www.ledger.com/) or a [Trezor](https://trezor.io/).
- [ ] Create a wallet address which is only used for signing and executing JuiceboxDAO Safe transactions.
- [ ] Register an ENS for your signer wallet. This makes your wallet easier to identify.
- [ ] Familiarize yourself with [Tenderly](https://tenderly.co/)'s features. If you submit any transactions, share a simulation on Discord.
- [ ] Join the Multisig Telegram (invitations sent via direct message).
