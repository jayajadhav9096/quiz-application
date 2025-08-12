import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from '../auth-guard/auth.guard';
import { adminGuard } from '../auth-guard/admin.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { ViewQuizComponent } from './view-quiz/view-quiz.component';
import { CategoriesDropdownComponent } from './categories-dropdown/categories-dropdown.component';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

export const routes: Routes = [{
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
}, {
    path: 'login',
    component: LoginComponent
}, {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
        { path: 'dashboard', component: CategoriesDropdownComponent },
        { path: 'view/:id', component: ViewQuizComponent },
        { path: 'quiz-list', component: QuizListComponent },
        {
            path: 'user-quiz-list',
            component: QuizListComponent,
            data: { mode: 'admin-view' },
            canActivate: [adminGuard]
        }
    ]
}, {
    path: 'quiz',
    component: QuizComponent,
    canActivate: [authGuard],
    canDeactivate: [CanDeactivateGuard]
}, {
    path: '**',
    component: PageNotFoundComponent
}
];
