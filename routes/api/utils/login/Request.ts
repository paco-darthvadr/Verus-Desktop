import { REQUEST_VDXF_KEY, VDXFObject, VerusIDSignature, VerusIDSignatureInterface } from "../vdxf";
import { Challenge, ChallengeInterface } from "./Challenge";

export interface RequestInterface {
  chain_id: string;
  signing_id: string;
  signature: VerusIDSignatureInterface;
  challenge: ChallengeInterface;
}

export class Request extends VDXFObject {
  chain_id: string;
  signing_id: string;
  signature: VerusIDSignature;
  challenge: Challenge;

  constructor(request: RequestInterface) {
    super(REQUEST_VDXF_KEY);

    this.chain_id = request.chain_id;
    this.signing_id = request.signing_id;
    this.signature = new VerusIDSignature(request.signature);
    this.challenge = new Challenge(request.challenge);
  }

  getSignedData() {
    return this.challenge.toString();
  }

  stringable() {
    return {
      vdxfkey: this.vdxfkey,
      chain_id: this.chain_id,
      signing_id: this.signing_id,
      signature: this.signature.stringable(),
      challenge: this.challenge.stringable(),
    };
  }
}
