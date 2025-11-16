from booking.models import TicketType
from decimal import Decimal
from abc import ABC, abstractmethod
        
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
    
class TicketFactory(ABC):
    def  order_ticket(self):
        ticket = self.create_ticket()
        return ticket
    
    @abstractmethod
    def create_ticket(self) -> BaseTicket:
        pass
    
class AdultTicketFactory(TicketFactory):
    def create_ticket(self) -> BaseTicket:
        return AdultTicket()
    
class SeniorTicketFactory(TicketFactory):
    def create_ticket(self) -> BaseTicket:
        return SeniorTicket()
    
class ChildTicketFactory(TicketFactory):
    def create_ticket(self) -> BaseTicket:
        return ChildTicket()
