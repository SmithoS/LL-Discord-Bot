import moment from "moment";

/**
 * セットリストのクラス
 */
export class Setlist {
  private id: string;
  private tourName: string;
  private concertName: string;
  private name: string;
  private date;
  constructor(id, tourName, concertName, name, date) {
    this.id = id;
    this.tourName = tourName;
    this.concertName = concertName;
    this.name = name;
    this.date = moment(date.substr(0, 10));
  }

  getId() {
    return this.id;
  }
  getTourName() {
    return this.tourName;
  }
  getConcertName() {
    return this.concertName;
  }
  getName() {
    return this.name;
  }
  getDate() {
    return this.date;
  }
}
