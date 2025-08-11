import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from '../auth-guard/auth.guard';
import { adminGuard } from '../auth-guard/admin.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { ViewQuizComponent } from './view-quiz/view-quiz.component';
import { CategoriesDropdownComponent } from './categories-dropdown/categories-dropdown.component';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { AppComponent } from './app.component';

// export const routes: Routes = [
//     {
//         path: '',
//         redirectTo: "/login",
//         pathMatch: 'full'
//     },
//     {
//         path: 'login',
//         component: LoginComponent
//     },
//     {
//         path: 'dashboard',
//         component: CategoriesDropdownComponent,
//         canActivate: [authGuard]

//     },
//     {
//         path: 'quiz',
//         component: QuizComponent,
//         canActivate: [authGuard],
//         canDeactivate: [CanDeactivateGuard]
//     },
//     {
//         path: 'view/:id',
//         component: ViewQuizComponent,
//         canActivate: [authGuard]
//     },
//     {
//         path: 'quiz-list',
//         component: QuizListComponent,
//          canActivate: [authGuard]
//     },
//     {
//         path: 'user-quiz-list',
//         component: QuizListComponent,
//         data: { mode: 'admin-view' },
//         canActivate: [authGuard,adminGuard]
//     },
//     // {
//     //     path: 'access-denied',
//     //     component: AccessDeniedComponent,
//     // },
//     {
//         path: '**',
//         component: PageNotFoundComponent
//     }

// ];

export const routes: Routes = [
    {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full'
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: '',
      component: DashboardComponent,
      canActivate: [authGuard],
      children: [
        { path: 'dashboard', component: CategoriesDropdownComponent },
        { path: 'quiz', component: QuizComponent, canDeactivate: [CanDeactivateGuard] },
        { path: 'view/:id', component: ViewQuizComponent },
        { path: 'quiz-list', component: QuizListComponent },
        {
          path: 'user-quiz-list',
          component: QuizListComponent,
          data: { mode: 'admin-view' },
          canActivate: [adminGuard]
        }
      ]
    },
    {
      path: '**',
      component: PageNotFoundComponent
    }
  ];
  