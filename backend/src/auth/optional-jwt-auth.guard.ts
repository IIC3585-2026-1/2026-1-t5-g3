import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, firstValueFrom, isObservable } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = super.canActivate(context);
      if (typeof result === 'boolean') {
        return result;
      }
      if (isObservable(result)) {
        return firstValueFrom(result);
      }
      return await result;
    } catch {
      return true;
    }
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser | null {
    if (err || !user) {
      return null;
    }

    return user;
  }
}
