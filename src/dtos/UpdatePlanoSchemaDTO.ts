import { z } from 'zod';
import { createPlanoSchema } from './CreatePlanoSchemaDTO.js';

export const updatePlanoSchema = createPlanoSchema.partial();

export type UpdatePlanoSchemaDTO = z.infer<typeof updatePlanoSchema>;