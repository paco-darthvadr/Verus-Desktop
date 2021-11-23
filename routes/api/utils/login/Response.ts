import { Decision, DecisionInterface } from "./Decision";
import { RESPONSE_VDXF_KEY, VDXFObject, VerusIDSignature, VerusIDSignatureInterface } from "../vdxf";

interface ResponseInterface {
  chain_id: string;
  signing_id: string;
  signature?: VerusIDSignatureInterface;
  decision: DecisionInterface;
}

export class Response extends VDXFObject {
  chain_id: string;
  signing_id: string;
  signature?: VerusIDSignature;
  decision: Decision;

  constructor(response: ResponseInterface) {
    super(RESPONSE_VDXF_KEY)
    
    this.chain_id = response.chain_id;
    this.signing_id = response.signing_id;
    this.decision = new Decision(response.decision);

    if (response.signature) {
      this.signature = new VerusIDSignature(response.signature);
    }
  }

  getSignedData() {
    return this.decision.toString()
  }

  stringable() {
    return {
      vdxfkey: this.vdxfkey,
      chain_id: this.chain_id,
      signature: this.signature,
      signing_id: this.signing_id,
      decision: this.decision.stringable()
    }
  }
}