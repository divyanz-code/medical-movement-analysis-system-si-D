from pydantic import BaseModel, ConfigDict, Field


class ProfileUpdateRequest(BaseModel):
    age: int = Field(ge=1, le=120)
    gender: str = Field(min_length=2, max_length=40)
    affected_limb: str = Field(min_length=2, max_length=80)


class ProfileResponse(BaseModel):
    name: str
    email: str
    age: int | None = None
    gender: str | None = None
    affected_limb: str | None = None

    model_config = ConfigDict(from_attributes=True)
