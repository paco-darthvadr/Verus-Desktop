const crypto = require('crypto')

export class Challenge {
  uuid: string;
  timestamp: number;
  user_id_address: string;

  constructor(uuid: string, timestamp: number, user_id_address: string) {
    this.uuid = uuid;
    this.timestamp = timestamp;
    this.user_id_address = user_id_address;
  }

  isValid() {
    return this.uuid != null && this.timestamp != null && this.user_id_address != null;
  }

  hash() {
    return crypto
      .createHash("sha256")
      .update(this.uuid)
      .update(this.timestamp.toString())
      .update(this.user_id_address)
      .digest()
      .toString('hex')
  }

  toJson() {
    return {
      uuid: this.uuid,
      timestamp: this.timestamp,
      user_id_address: this.user_id_address
    }
  }
}