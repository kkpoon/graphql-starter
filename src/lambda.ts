/*
 * Copyright 2017 kkpoon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { APIGatewayEvent, Context, Callback } from "aws-lambda";
import { graphqlLambda, graphiqlLambda } from "graphql-server-lambda";
import resolvers from "./resolvers";
import { executableSchema } from "./schema";

const CORS_ORIGINS = process.env.CORS_ORIGINS;

export const graphql = (
    event: APIGatewayEvent,
    context: Context,
    callback: Callback
) => {
    graphqlLambda({
        schema: executableSchema(resolvers()),
        formatError: (err: Error) => { console.error(err); return err; }
    })(event, context, function(err, output) {
        let matchedCORS = CORS_ORIGINS
            .split(",")
            .map((o: string) => o.trim())
            .filter((o: string) => o === event.headers.origin);
        if (matchedCORS.length > 0) {
            output.headers = output.headers || {};
            output.headers['Access-Control-Allow-Credentials'] = 'true';
            output.headers['Access-Control-Allow-Origin'] = event.headers.origin;
        }
        console.log("response: " + JSON.stringify(output));
        callback(err, output);
    });
}

export const graphiql = graphiqlLambda({ endpointURL: '../graphql' });
