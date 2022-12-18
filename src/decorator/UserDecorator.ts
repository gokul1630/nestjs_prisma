import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();
    if (data) {
      return { [data]: user[data] };
    }
    return user;
  },
);
