import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ViewGroup } from '../../enums/view.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class ViewInput { // DTO (Data Transfer Object) for member input
    @IsNotEmpty() //bosh bolmasligi kerak
    @Field(() => String)// GraphQL fi
    memberId: ObjectId;

    @IsNotEmpty() //bosh bolmasligi kerak
    @Field(() => String)// GraphQL fi
    viewRefId: ObjectId;


    @IsNotEmpty() //bosh bolmasligi kerak
    @Field(() => ViewGroup)// GraphQL fi
    viewGroup: ViewGroup; 

   
}