import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export interface IContext {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
}