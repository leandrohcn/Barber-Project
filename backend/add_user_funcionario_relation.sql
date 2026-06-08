-- Add userId column to funcionarios table
ALTER TABLE funcionarios ADD COLUMN userId VARCHAR(191);

-- Add unique constraint on userId
ALTER TABLE funcionarios ADD CONSTRAINT funcionarios_userId_unique UNIQUE (userId);

-- Add foreign key constraint
ALTER TABLE funcionarios ADD CONSTRAINT funcionarios_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL;

-- Add index on userId
ALTER TABLE funcionarios ADD INDEX funcionarios_userId_idx (userId);

-- Update the horarios_funcionamento to remove organizationId from the unique/required constraint
-- (It's already in the schema but we need to ensure funcionarioId is properly linked)
