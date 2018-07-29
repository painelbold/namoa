import { TravelTrade } from "./travelTrade";

export class TravelPlan {
    key: string;
    title: string;
    startDateTrip: Date;
    endDateTrip: Date;
    trades: Array<TravelTrade>;
    publishDate: any;
}
