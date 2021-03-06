import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Request, Response } from 'express';

export interface IContext {
	em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
	req: Request;
	res: Response;
}
