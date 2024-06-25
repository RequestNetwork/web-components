export default function extendCustomElement(customElementConstructor: any) {
  return class extends customElementConstructor {
    private _config: Record<string, any> = {};
    private _wallet: Record<string, any> = {};
    private _requestNetwork: Record<string, any> = {};

    set config(value: Record<string, any>) {
      this._config = value;
      this.dispatchEvent(new CustomEvent("config-changed", { detail: value }));
    }
    get config() {
      return this._config;
    }

    set wallet(value: Record<string, any>) {
      this._wallet = value;
      this.dispatchEvent(new CustomEvent("wallet-changed", { detail: value }));
    }
    get wallet() {
      return this._wallet;
    }

    set requestNetwork(value: Record<string, any>) {
      this._requestNetwork = value;
      this.dispatchEvent(
        new CustomEvent("requestnetwork-changed", { detail: value })
      );
    }
    get requestNetwork() {
      return this._requestNetwork;
    }

    connectedCallback() {
      super.connectedCallback();
      if (this.config) {
        this.config = this.config;
      }
      if (this.wallet) {
        this.wallet = this.wallet;
      }
      if (this.requestNetwork) {
        this.requestNetwork = this.requestNetwork;
      }
    }

    static get observedAttributes() {
      return ["config", "wallet", "requestNetwork"];
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
      if (name === "config") {
        this.config = newValue;
      } else if (name === "wallet") {
        this.wallet = newValue;
      } else if (name === "requestNetwork") {
        this.requestNetwork = newValue;
      }
    }
  };
}
