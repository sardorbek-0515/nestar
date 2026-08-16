import { Module } from "@nestjs/common";
import { InjectConnection, MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        console.log("NODE_ENV:", process.env.NODE_ENV);
        console.log("MONGO_DEV:", process.env.MONGO_DEV);

        return {
          uri:
            process.env.NODE_ENV === "production"
              ? process.env.MONGO_PROD
              : process.env.MONGO_DEV,
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {
    if (connection.readyState === 1) {
      console.log(
        `MongoDB is connected into ${
          process.env.NODE_ENV === "production"
            ? "production"
            : "development"
        } db`,
      );
    } else {
      console.log("DB is not connected!");
    }
  }
}