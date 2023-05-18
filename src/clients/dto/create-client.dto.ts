import { IsEmail, Matches, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @Matches(
    /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/,
    { message: 'must be a valid brazilian number.' },
  )
  readonly phoneNumber: string;
}
