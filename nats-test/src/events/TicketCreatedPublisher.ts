import Publisher from "./basePublisher";
import TicketCreatedEvent from "./TicketCreatedEvent";
import {Subjects} from "./subjects";

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
 readonly subject = Subjects.TicketCreated;
}