import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger: Logger = new Logger();

	public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		const recordTime = Date.now();
		const requestType = context.getType<GqlContextType>();
		this.logger.log(` Type ${requestType}`, 'Request');

		if (requestType === 'http') {
			/**  Develop if needed **/
		} else if (requestType === 'graphql') {
			/** Print Request **/
			const gqlContext = GqlExecutionContext.create(context);
			console.log('gqlContext =>', gqlContext.getContext().req.body);
			this.logger.log(`Type ${this.stringify(gqlContext.getContext().req.body)}`, 'REQUEST');
		}
		/** Errors hendling via GraphQL **/

		/** No Errors giving Response */
		return next.handle().pipe(
			tap((context) => {
				const responseTime = Date.now() - recordTime;
				this.logger.log(`${this.stringify(context)} ${responseTime}ms \n\n`, 'RESPONSE');
			}),
		);
	}

	private stringify(context: ExecutionContext): string {
		console.log(typeof context);
		return JSON.stringify(context).slice(0, 75);
	}
}