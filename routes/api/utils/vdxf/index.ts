import { VDXFKeyInterface, VERUSID_SIG_VDXF_KEY } from './keys';
export * from './keys'

export interface VDXFObjectInterface {
  vdxfkey: VDXFKeyInterface;
  toString: () => string;
  stringable: () => { [key: string]: any };
}

export interface VerusIDSignatureInterface {
  signature: string;
}

export class VDXFObject implements VDXFObjectInterface {
  vdxfkey: VDXFKeyInterface;
  
  constructor(key: VDXFKeyInterface) {
    this.vdxfkey = key
  }

  stringable() {
    return {}
  }

  toString() {
    return JSON.stringify(this.stringable())
  }
}

export class VerusIDSignature extends VDXFObject {
  signature: string;

  constructor(sig: VerusIDSignatureInterface) {
    super(VERUSID_SIG_VDXF_KEY)
    this.signature = sig.signature
  }

  stringable() {
    return {
      vdxfkey: this.vdxfkey,
      signature: this.signature
    }
  }
}
