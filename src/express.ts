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

import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as morgan from "morgan";
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import resolvers from "./resolvers";
import { executableSchema } from "./schema";

interface Options { enableGraphiql: boolean; corsOrigins: string }

const DEFAULT_OPTIONS = { enableGraphiql: true, corsOrigins: "" };

export const CreateExpressApp = (opts: Options) => {
    const options = Object.assign({}, DEFAULT_OPTIONS, opts);
    const app = express();
    app.use(morgan("combined"));
    app.use(
        "/graphql",
        cors({
            origin: options.corsOrigins.split(",").map((d) => d.trim()),
            credentials: true
        }),
        bodyParser.json(),
        graphqlExpress({
            schema: executableSchema(resolvers()),
            formatError: (err: Error) => { console.error(err); return err; }
        })
    );
    if (options.enableGraphiql) {
        app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql', }));
    }
    return app;
};
