export interface VDXFKeyInterface {
  vdxfid: string;
  hash160result: string;
  qualifiedname: {
    name: string;
    namespace: string;
  };
}

export const VERUSID_SIG_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iBFueEbXnSbohqiHNwwmz8Jb7LJtx2PGFu",
  hash160result: "28657ae163daff6bcb81034044699a4170235e55",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.signature",
  },
};

export const REQUEST_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iMLgtMWiS4GFDHziUZ4rhX5NEimkjYX3YP",
  hash160result: "b5208d9483f0a167c592a11151637cc0d2d3f6c3",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.request",
  },
};

export const RESPONSE_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iDFBQj3pj1VPsJTsC5xY9suWGZ5kPCb89G",
  hash160result: "983b708f0338d60aed0f2fec59519b55bf222b6b",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.response",
  },
};

export const CHALLENGE_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iN4L9z1RxKoc5PS2bvSB6ZX6q75APmFcYz",
  hash160result: "7953357278f7c80766934dcf2f5d4db22bfed6cb",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.request.challenge",
  },
};

export const DECISION_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "i7JoRifxCxE6BPaVYH1eGJzpbEkyz83nnD",
  hash160result: "4c4d8d5d38af2615ed61faecf57e54c3cab1092a",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.response.decision",
  },
};

export const CLIENT_VDXF_KEY: VDXFKeyInterface = {
  vdxfid: "iQCQhqb4Hq4oKedsKFMSJRZCrML18vtLbR",
  hash160result: "b6a592069f501bf50ee8d0978b5fe8109f5e4ee3",
  qualifiedname: {
    namespace: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    name: "vrsc::system.identity.authentication.client",
  },
};