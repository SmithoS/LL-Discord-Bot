export class DeleteMessageReason {
  private _userId: string;
  private _datetime: string;
  private _userName: string;
  private _channelId: string;
  private _channelName: string;
  private _type: string;
  private _message: string;
  private _reasonMsg: string;

  constructor(
    userId: string,
    datetime: string,
    userName: string,
    channelId: string,
    channelName: string,
    type: string,
    message: string,
    reasonMsg: string
  ) {
    this.userId = userId;
    this.datetime = datetime;
    this.userName = userName;
    this.channelId = channelId;
    this.channelName = channelName;
    this.type = type;
    this.message = message;
    this.reasonMsg = reasonMsg;
  }

  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  get datetime(): string {
    return this._datetime;
  }
  set datetime(value: string) {
    this._datetime = value;
  }

  get userName(): string {
    return this._userName;
  }
  set userName(value: string) {
    this._userName = value;
  }

  get channelId(): string {
    return this._channelId;
  }
  set channelId(value: string) {
    this._channelId = value;
  }

  get channelName(): string {
    return this._channelName;
  }
  set channelName(value: string) {
    this._channelName = value;
  }

  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
  }

  get message(): string {
    return this._message;
  }
  set message(value: string) {
    this._message = value;
  }

  get reasonMsg(): string {
    return this._reasonMsg;
  }
  set reasonMsg(value: string) {
    this._reasonMsg = value;
  }
}
