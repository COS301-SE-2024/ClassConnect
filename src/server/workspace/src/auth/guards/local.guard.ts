import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
