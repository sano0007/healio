import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {DoctorsModule} from './doctors/doctors.module';
import {AppointmentsModule} from './appointments/appointments.module';
import {PrescriptionsModule} from './prescriptions/prescriptions.module';
import {ChatbotModule} from './chatbot/chatbot.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        UsersModule,
        AuthModule,
        DoctorsModule,
        AppointmentsModule,
        PrescriptionsModule,
        ChatbotModule,
    ],
})
export class AppModule {
}
