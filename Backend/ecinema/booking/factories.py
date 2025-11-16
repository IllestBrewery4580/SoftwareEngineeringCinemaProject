from booking.models import TicketType
from decimal import Decimal
from abc import ABC, abstractmethod

class TicketFactory():
    def create(self, ticket_type: TicketType):
        if ticket_type.name == 'Adult':
            return AdultTicket()
        elif ticket_type.name == 'Senior':
            return SeniorTicket()
        elif ticket_type.name == 'Child':
            return ChildTicket()
        else:
            return None
        
class BaseTicket(ABC):
    base_price = Decimal('12.50')

    @abstractmethod
    def get_price(self):
        pass

class AdultTicket(BaseTicket):
    def get_price(self):
        return self.base_price
    
class SeniorTicket(BaseTicket):
    def get_price(self):
        return self.base_price * Decimal('0.8')
    
class ChildTicket(BaseTicket):
    def get_price(self):
        return self.base_price * Decimal('0.64')
