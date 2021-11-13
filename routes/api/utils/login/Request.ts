const crypto = require('crypto')

export class Request {
  uuid: string;
  timestamp: number;
  service_id_address: string;

  constructor(uuid: string, timestamp: number, service_id_address: string) {
    this.uuid = uuid;
    this.timestamp = timestamp;
    this.service_id_address = service_id_address;
  }

  isValid() {
    return this.uuid != null && this.timestamp != null && this.service_id_address != null;
  }

  hash() {
    return crypto
      .createHash("sha256")
      .update(this.uuid)
      .update(this.timestamp.toString())
      .update(this.service_id_address)
      .digest()
      .toString('hex')
  }

  toJson() {
    return {
      uuid: this.uuid,
      timestamp: this.timestamp,
      service_id_address: this.service_id_address
    }
  }
}