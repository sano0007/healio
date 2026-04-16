import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CheckSymptomsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  symptoms: string;
}
