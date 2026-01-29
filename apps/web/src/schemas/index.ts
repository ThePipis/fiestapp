import { z } from 'zod';

export const GuestSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  vinculo: z.string().default(''),
  grupo: z.string().default('Familia Directa'),
  adultos: z.number().int().min(1),
  ninos: z.number().int().min(0),
  responsable: z.array(z.string()).default([]),
  estado: z.string().default('Pendiente'),
});

export const ExpenseSchema = z.object({
  item: z.string().min(2, "El concepto es obligatorio"),
  categoria: z.string().default('General'),
  costo: z.number().min(0),
  responsable: z.array(z.string()).default([]),
  pagos: z.record(z.string(), z.number()).default({}),
});

export const TaskSchema = z.object({
  descripcion: z.string().min(3, "La descripción es obligatoria"),
  responsable: z.string().default(''),
  completada: z.boolean().default(false),
});

export type Guest = z.infer<typeof GuestSchema>;
export type Expense = z.infer<typeof ExpenseSchema>;
export type Task = z.infer<typeof TaskSchema>;
