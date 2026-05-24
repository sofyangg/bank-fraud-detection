import uuid
from datetime import datetime, timezone
from typing import List, Tuple

from pydantic import EmailStr
from sqlalchemy import DateTime
from sqlmodel import Field, Relationship, SQLModel


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)

class Transaction(SQLModel, table=True):
    __tablename__ = "Transaction"
    # IDs - Primary Key and searchable User ID
    Transaction_ID: str = Field(primary_key=True)
    User_ID: str = Field(index=True)
    #= Field(index=True)
    
    # Numerical Features (float64 equivalents)
    Transaction_Amount: float
    Account_Balance: float
    Avg_Transaction_Amount_7d: float
    Transaction_Distance: float
    Risk_Score: float
    
    # Categorical Features (object equivalents)
    Transaction_Type: str
    Device_Type: str
    Location: str
    Merchant_Category: str
    Card_Type: str
    Authentication_Method: str
    
    # Date/Time
    Timestamp: datetime
    
    # Binary / Integer Flags (int64 equivalents)
    # Using int because XGBoost prefers 0/1 over True/False
    IP_Address_Flag: int
    Previous_Fraudulent_Activity: int
    Is_Weekend: int
    Fraud_Label: int | None = Field(default=None)
    
    Fraud_Probability: float | None = Field(default=None)
    # Counts
    Daily_Transaction_Count: int
    Failed_Transaction_Count_7d: int
    Card_Age: int


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime | None = None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime | None = None


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)



class KPISummary(SQLModel):
    total_transactions: int
    total_exposure_amount: float
    total_fraud_count: int
    total_fraud_value: float
    avg_top_decile_risk: float


class RadialPolarBar(SQLModel):
    Hours: List[float]


class MetalBar_Data(SQLModel):
    records: List[Tuple[float, float, int]]

class HeatMap_Data(SQLModel):
    heat: List[List[float]]

class Barchart_risk_bands_Data(SQLModel):
    bands:List[int]

class Sankey_Link(SQLModel):
    From:str
    To:str
    Value:int


class Sankey_Data(SQLModel):
    Links:List[Sankey_Link]

class Visuals(SQLModel):
    RadialPolar:RadialPolarBar
    HeatMap:HeatMap_Data
    Barchart:Barchart_risk_bands_Data
    Sankey:Sankey_Data
