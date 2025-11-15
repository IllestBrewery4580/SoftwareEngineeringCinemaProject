class TicketFactory():
    def create(ticket_type):
        if ticket_type.name == 'Adult':
            return AdultTicket()
        elif ticket_type.name == 'Senior':
            return SeniorTicket()
        elif ticket_type.name == 'Child':
            return ChildTicket()
        else:
            return BaseTicket()

class BaseTicket:
    price = 0.00

    def get_price(self):
        return self.price
    
class AdultTicket(BaseTicket):
    price = 12.50

class SeniorTicket(BaseTicket):
    price = 10.00

class ChildTicket(BaseTicket):
    price = 8.00