import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';
import { combineLatest, Subscription } from 'rxjs';

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  roles?: string[];
  roleId?: number;
};

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    SafeHtmlPipe,
  ],
  templateUrl: './app-sidebar.component.html',
})
export class AppSidebarComponent {

  // Main nav items
  navItems: NavItem[] = [
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z" fill="currentColor"></path></svg>`,
      name: "Patients",
      path: "/patients",
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.50391 4.25C8.50391 3.83579 8.83969 3.5 9.25391 3.5H15.2777C15.4766 3.5 15.6674 3.57902 15.8081 3.71967L18.2807 6.19234C18.4214 6.333 18.5004 6.52376 18.5004 6.72268V16.75C18.5004 17.1642 18.1646 17.5 17.7504 17.5H16.248V17.4993H14.748V17.5H9.25391C8.83969 17.5 8.50391 17.1642 8.50391 16.75V4.25ZM14.748 19H9.25391C8.01126 19 7.00391 17.9926 7.00391 16.75V6.49854H6.24805C5.83383 6.49854 5.49805 6.83432 5.49805 7.24854V19.75C5.49805 20.1642 5.83383 20.5 6.24805 20.5H13.998C14.4123 20.5 14.748 20.1642 14.748 19.75L14.748 19ZM7.00391 4.99854V4.25C7.00391 3.00736 8.01127 2 9.25391 2H15.2777C15.8745 2 16.4468 2.23705 16.8687 2.659L19.3414 5.13168C19.7634 5.55364 20.0004 6.12594 20.0004 6.72268V16.75C20.0004 17.9926 18.9931 19 17.7504 19H16.248L16.248 19.75C16.248 20.9926 15.2407 22 13.998 22H6.24805C5.00541 22 3.99805 20.9926 3.99805 19.75V7.24854C3.99805 6.00589 5.00541 4.99854 6.24805 4.99854H7.00391Z" fill="currentColor"></path></svg>`,
      name: "Medical Records",
      path: "/dossiers",
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11ZM8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7C6 8.10457 6.89543 9 8 9Z" fill="currentColor"/><path d="M11 14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14V15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H13V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V17H10C9.44772 17 9 16.5523 9 16C9 15.4477 9.44772 15 10 15H11V14Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M18 11C20.2091 11 22 9.20914 22 7C22 4.79086 20.2091 3 18 3C15.7909 3 14 4.79086 14 7C14 9.20914 15.7909 11 18 11ZM18 9C19.1046 9 20 8.10457 20 7C20 5.89543 19.1046 5 18 5C16.8954 5 16 5.89543 16 7C16 8.10457 16.8954 9 18 9Z" fill="currentColor"/><path d="M2.20164 16.1133C2.4116 15.0635 3.3276 14.25 4.3944 14.0722C5.58914 13.873 6.79036 13.75 8 13.75C9.20964 13.75 10.4109 13.873 11.6056 14.0722C12.6724 14.25 13.5884 15.0635 13.7984 16.1133L14.0049 17.1462C14.062 17.4316 13.9213 17.7145 13.6702 17.8541C12.2882 18.6225 10.419 19.25 8 19.25C5.581 19.25 3.71181 18.6225 2.32977 17.8541C2.07869 17.7145 1.93802 17.4316 1.99506 17.1462L2.20164 16.1133Z" fill="currentColor"/><path d="M14.6433 13.9189C15.5492 14.1506 16.1969 14.8872 16.3263 15.7932L16.4808 16.8742C16.5188 17.1404 16.3989 17.4063 16.1809 17.5582C15.9392 17.7265 15.6559 17.8817 15.3407 18.0199C15.1187 18.1172 14.8569 18.0381 14.7352 17.8286C14.5097 17.4402 14.1209 17.1755 13.6702 17.1004C13.4357 17.0613 13.238 16.8837 13.2036 16.6477L13.1118 16.0227C12.9818 15.137 12.2155 14.4751 11.3195 14.402C11.1278 14.3863 11.002 14.1802 11.085 14.0028C12.2141 13.5855 13.4072 13.6033 14.6433 13.9189Z" fill="currentColor"/></svg>`,
      name: "Users",
      path: "/users",
      roleId: 1,
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.25 5.5C3.25 4.25736 4.25736 3.25 5.5 3.25H18.5C19.7426 3.25 20.75 4.25736 20.75 5.5V18.5C20.75 19.7426 19.7426 20.75 18.5 20.75H5.5C4.25736 20.75 3.25 19.7426 3.25 18.5V5.5ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5V18.5C4.75 18.9142 5.08579 19.25 5.5 19.25H18.5C18.9142 19.25 19.25 18.9142 19.25 18.5V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H5.5Z" fill="currentColor"/><path d="M8 8.75C7.58579 8.75 7.25 9.08579 7.25 9.5C7.25 9.91421 7.58579 10.25 8 10.25H16C16.4142 10.25 16.75 9.91421 16.75 9.5C16.75 9.08579 16.4142 8.75 16 8.75H8Z" fill="currentColor"/><path d="M7.25 12.5C7.25 12.0858 7.58579 11.75 8 11.75H16C16.4142 11.75 16.75 12.0858 16.75 12.5C16.75 12.9142 16.4142 13.25 16 13.25H8C7.58579 13.25 7.25 12.9142 7.25 12.5Z" fill="currentColor"/><path d="M7.25 15.5C7.25 15.0858 7.58579 14.75 8 14.75H12C12.4142 14.75 12.75 15.0858 12.75 15.5C12.75 15.9142 12.4142 16.25 12 16.25H8C7.58579 16.25 7.25 15.9142 7.25 15.5Z" fill="currentColor"/></svg>`,
      name: "Factures",
      path: "/factures",
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C10.7574 2.75 9.75 3.75736 9.75 5C9.75 6.24264 10.7574 7.25 12 7.25C13.2426 7.25 14.25 6.24264 14.25 5C14.25 3.75736 13.2426 2.75 12 2.75ZM8.25 5C8.25 2.92893 9.92893 1.25 12 1.25C14.0711 1.25 15.75 2.92893 15.75 5C15.75 7.07107 14.0711 8.75 12 8.75C9.92893 8.75 8.25 7.07107 8.25 5Z" fill="currentColor"/><path d="M3.25 10.5C3.25 9.25736 4.25736 8.25 5.5 8.25H18.5C19.7426 8.25 20.75 9.25736 20.75 10.5V19.5C20.75 20.7426 19.7426 21.75 18.5 21.75H5.5C4.25736 21.75 3.25 20.7426 3.25 19.5V10.5ZM5.5 9.75C5.08579 9.75 4.75 10.0858 4.75 10.5V19.5C4.75 19.9142 5.08579 20.25 5.5 20.25H18.5C18.9142 20.25 19.25 19.9142 19.25 19.5V10.5C19.25 10.0858 18.9142 9.75 18.5 9.75H5.5Z" fill="currentColor"/><path d="M8.75 14C8.75 13.5858 9.08579 13.25 9.5 13.25H14.5C14.9142 13.25 15.25 13.5858 15.25 14C15.25 14.4142 14.9142 14.75 14.5 14.75H9.5C9.08579 14.75 8.75 14.4142 8.75 14Z" fill="currentColor"/><path d="M8.75 17C8.75 16.5858 9.08579 16.25 9.5 16.25H12.5C12.9142 16.25 13.25 16.5858 13.25 17C13.25 17.4142 12.9142 17.75 12.5 17.75H9.5C9.08579 17.75 8.75 17.4142 8.75 17Z" fill="currentColor"/></svg>`,
      name: "Actions",
      path: "/actions",
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7C21 8.10457 20.1046 9 19 9H5C3.89543 9 3 8.10457 3 7V5ZM5 4.5C4.72386 4.5 4.5 4.72386 4.5 5V7C4.5 7.27614 4.72386 7.5 5 7.5H19C19.2761 7.5 19.5 7.27614 19.5 7V5C19.5 4.72386 19.2761 4.5 19 4.5H5ZM3 12C3 10.8954 3.89543 10 5 10H19C20.1046 10 21 10.8954 21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V12ZM5 11.5C4.72386 11.5 4.5 11.7239 4.5 12V19C4.5 19.2761 4.72386 19.5 5 19.5H19C19.2761 19.5 19.5 19.2761 19.5 19V12C19.5 11.7239 19.2761 11.5 19 11.5H5ZM7 14.75C7 14.3358 7.33579 14 7.75 14H10.25C10.6642 14 11 14.3358 11 14.75C11 15.1642 10.6642 15.5 10.25 15.5H7.75C7.33579 15.5 7 15.1642 7 14.75Z" fill="currentColor"/></svg>`,
      name: "Hospitalisations",
      path: "/hospitalisations",
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12Z" fill="currentColor"/><path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      name: "Imaging",
      path: "/imaging",
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 2.75C5.30964 2.75 4.75 3.30964 4.75 4V20C4.75 20.6904 5.30964 21.25 6 21.25H18C18.6904 21.25 19.25 20.6904 19.25 20V8.31066L14.6893 3.75H6ZM3.25 4C3.25 2.48122 4.48122 1.25 6 1.25H15C15.1989 1.25 15.3897 1.32902 15.5303 1.46967L20.5303 6.46967C20.671 6.61032 20.75 6.80109 20.75 7V20C20.75 21.5188 19.5188 22.75 18 22.75H6C4.48122 22.75 3.25 21.5188 3.25 20V4ZM14.25 2V7C14.25 7.41421 14.5858 7.75 15 7.75H20M7.75 13C7.75 12.5858 8.08579 12.25 8.5 12.25H15.5C15.9142 12.25 16.25 12.5858 16.25 13C16.25 13.4142 15.9142 13.75 15.5 13.75H8.5C8.08579 13.75 7.75 13.4142 7.75 13ZM7.75 16.5C7.75 16.0858 8.08579 15.75 8.5 15.75H12.5C12.9142 15.75 13.25 16.0858 13.25 16.5C13.25 16.9142 12.9142 17.25 12.5 17.25H8.5C8.08579 17.25 7.75 16.9142 7.75 16.5Z" fill="currentColor"/></svg>`,
      name: "Documents",
      path: "/documents",
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C9.92893 2.75 8.25 4.42893 8.25 6.5C8.25 8.57107 9.92893 10.25 12 10.25C14.0711 10.25 15.75 8.57107 15.75 6.5C15.75 4.42893 14.0711 2.75 12 2.75ZM6.75 6.5C6.75 3.6005 9.1005 1.25 12 1.25C14.8995 1.25 17.25 3.6005 17.25 6.5C17.25 9.3995 14.8995 11.75 12 11.75C9.1005 11.75 6.75 9.3995 6.75 6.5ZM4 19.5C4 16.4624 6.46243 14 9.5 14H14.5C17.5376 14 20 16.4624 20 19.5V21.25C20 21.6642 19.6642 22 19.25 22C18.8358 22 18.5 21.6642 18.5 21.25V19.5C18.5 17.2909 16.7091 15.5 14.5 15.5H9.5C7.29086 15.5 5.5 17.2909 5.5 19.5V21.25C5.5 21.6642 5.16421 22 4.75 22C4.33579 22 4 21.6642 4 21.25V19.5Z" fill="currentColor"/><path d="M15 8H19M17 6V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      name: "Episodes",
      path: "/episodes",
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 3.75H15C15.4142 3.75 15.75 4.08579 15.75 4.5V5.25H17C18.2426 5.25 19.25 6.25736 19.25 7.5V19.5C19.25 20.7426 18.2426 21.75 17 21.75H7C5.75736 21.75 4.75 20.7426 4.75 19.5V7.5C4.75 6.25736 5.75736 5.25 7 5.25H8.25V4.5C8.25 4.08579 8.58579 3.75 9 3.75ZM8.25 6.75H7C6.58579 6.75 6.25 7.08579 6.25 7.5V19.5C6.25 19.9142 6.58579 20.25 7 20.25H17C17.4142 20.25 17.75 19.9142 17.75 19.5V7.5C17.75 7.08579 17.4142 6.75 17 6.75H15.75V7.5C15.75 7.91421 15.4142 8.25 15 8.25H9C8.58579 8.25 8.25 7.91421 8.25 7.5V6.75ZM9.75 5.25V6.75H14.25V5.25H9.75ZM8.75 11C8.75 10.5858 9.08579 10.25 9.5 10.25H14.5C14.9142 10.25 15.25 10.5858 15.25 11C15.25 11.4142 14.9142 11.75 14.5 11.75H9.5C9.08579 11.75 8.75 11.4142 8.75 11ZM8.75 14C8.75 13.5858 9.08579 13.25 9.5 13.25H14.5C14.9142 13.25 15.25 13.5858 15.25 14C15.25 14.4142 14.9142 14.75 14.5 14.75H9.5C9.08579 14.75 8.75 14.4142 8.75 14ZM8.75 17C8.75 16.5858 9.08579 16.25 9.5 16.25H12C12.4142 16.25 12.75 16.5858 12.75 17C12.75 17.4142 12.4142 17.75 12 17.75H9.5C9.08579 17.75 8.75 17.4142 8.75 17Z" fill="currentColor"/></svg>`,
      name: "Lab Results",
      path: "/lab-reports",
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 2.75C5.30964 2.75 4.75 3.30964 4.75 4V20C4.75 20.6904 5.30964 21.25 6 21.25H18C18.6904 21.25 19.25 20.6904 19.25 20V8.31066L14.6893 3.75H6ZM3.25 4C3.25 2.48122 4.48122 1.25 6 1.25H15C15.1989 1.25 15.3897 1.32902 15.5303 1.46967L20.5303 6.46967C20.671 6.61032 20.75 6.80109 20.75 7V20C20.75 21.5188 19.5188 22.75 18 22.75H6C4.48122 22.75 3.25 21.5188 3.25 20V4Z" fill="currentColor"/><path d="M14.25 2V7C14.25 7.41421 14.5858 7.75 15 7.75H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7.75 13C7.75 12.5858 8.08579 12.25 8.5 12.25H15.5C15.9142 12.25 16.25 12.5858 16.25 13C16.25 13.4142 15.9142 13.75 15.5 13.75H8.5C8.08579 13.75 7.75 13.4142 7.75 13Z" fill="currentColor"/><path d="M7.75 16.5C7.75 16.0858 8.08579 15.75 8.5 15.75H12.5C12.9142 15.75 13.25 16.0858 13.25 16.5C13.25 16.9142 12.9142 17.25 12.5 17.25H8.5C8.08579 17.75 7.75 16.9142 7.75 16.5Z" fill="currentColor"/></svg>`,
      name: "Scheduling",
      subItems: [
        { name: "Schedules", path: "/schedules" },
        { name: "Templates", path: "/templates" },
      ],
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H5M19 12H21M12 3V5M12 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM6.75 12C6.75 9.10051 9.10051 6.75 12 6.75C14.8995 6.75 17.25 9.10051 17.25 12C17.25 14.8995 14.8995 17.25 12 17.25C9.10051 17.25 6.75 14.8995 6.75 12Z" fill="currentColor"/><path d="M11.25 9V12.75H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      name: "Monitoring",
      subItems: [
        { name: "Dashboard", path: "/monitoring" },
        { name: "Vital Signs", path: "/vital-signs" },
        { name: "Patient Alerts", path: "/patient-alerts" },
        { name: "Thresholds", path: "/thresholds" },
        { name: "Growth Charts", path: "/growth-charts" },
        { name: "Renal Functions", path: "/renal-functions" },
        { name: "Medical Notes", path: "/medical-notes" },
      ],
    },
    {
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z" fill="currentColor"/><path d="M8.5 12H15.5M12 8.5V15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      name: "Transplant",
      subItems: [
        { name: "Kidney Transplants", path: "/transplant" },
        { name: "Biopsies", path: "/biopsy" },
        { name: "Rejection Episodes", path: "/kidney-transplants/rejection-episodes" },
        { name: "Complications", path: "/kidney-transplants/complications" },
        { name: "HLA Compatibility", path: "/kidney-transplants/hla-compatibilities" },
        { name: "Immunosuppressants", path: "/protocole-post-greffe" },
        { name: "Surveillance Protocols", path: "/kidney-transplants/surveillance-protocols" },
      ],
    },
  ];
  // Others nav items
  othersItems: NavItem[] = [];

  openSubmenu: string | null | number = null;
  subMenuHeights: { [key: string]: number } = {};
  @ViewChildren('subMenu') subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
  }

  ngOnInit() {
    const role = this.authService.getUserRole();
    const roleId = this.authService.getUserRoleId();
    console.log(role, roleId, "hhhhhhhhhhhhhhhh");

    if (roleId !== null || role !== null) {
      this.navItems = this.navItems.filter(item => {
        // If item has roleId, check it
        if (item.roleId !== undefined) {
          return roleId === item.roleId;
        }
        // Fallback to role names if roleId not specified
        if (item.roles) {
          return role && item.roles.includes(role);
        }
        // Item is for everyone
        return true;
      });
    }

    // Subscribe to router events
    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenuFromRoute(this.router.url);
        }
      })
    );

    // Subscribe to combined observables to close submenus when all are false
    this.subscription.add(
      combineLatest([this.isExpanded$, this.isMobileOpen$, this.isHovered$]).subscribe(
        ([isExpanded, isMobileOpen, isHovered]) => {
          if (!isExpanded && !isMobileOpen && !isHovered) {
            // this.openSubmenu = null;
            // this.savedSubMenuHeights = { ...this.subMenuHeights };
            // this.subMenuHeights = {};
            this.cdr.detectChanges();
          } else {
            // Restore saved heights when reopening
            // this.subMenuHeights = { ...this.savedSubMenuHeights };
            // this.cdr.detectChanges();
          }
        }
      )
    );

    // Initial load
    this.setActiveMenuFromRoute(this.router.url);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
    } else {
      this.openSubmenu = key;

      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges(); // Ensure UI updates
        }
      });
    }
  }

  onSidebarMouseEnter() {
    this.isExpanded$.subscribe(expanded => {
      if (!expanded) {
        this.sidebarService.setHovered(true);
      }
    }).unsubscribe();
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    const menuGroups = [
      { items: this.navItems, prefix: 'main' },
      { items: this.othersItems, prefix: 'others' },
    ];

    menuGroups.forEach(group => {
      group.items.forEach((nav, i) => {
        if (nav.subItems) {
          nav.subItems.forEach(subItem => {
            if (currentUrl === subItem.path) {
              const key = `${group.prefix}-${i}`;
              this.openSubmenu = key;

              setTimeout(() => {
                const el = document.getElementById(key);
                if (el) {
                  this.subMenuHeights[key] = el.scrollHeight;
                  this.cdr.detectChanges(); // Ensure UI updates
                }
              });
            }
          });
        }
      });
    });
  }

  onSubmenuClick() {
    console.log('click submenu');
    this.isMobileOpen$.subscribe(isMobile => {
      if (isMobile) {
        this.sidebarService.setMobileOpen(false);
      }
    }).unsubscribe();
  }


}
