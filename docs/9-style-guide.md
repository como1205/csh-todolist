# csh-TodoList 스타일 가이드

> Tailwind CSS를 사용한 UI 디자인 시스템 가이드

## 1. 색상 팔레트 (Color Palette)

### Primary Colors (주요 색상)

```js
// tailwind.config.js에 정의할 커스텀 색상
colors: {
  primary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // 메인 레드 (버튼, 강조)
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  }
}
```

**사용 예시:**

- 주요 액션 버튼: `bg-primary-500 hover:bg-primary-600`
- Add task 버튼: `bg-primary-500 text-white`
- FAB (Floating Action Button): `bg-primary-500 hover:bg-primary-600`

### Neutral Colors (중립 색상)

```js
// 기본 gray 스케일 사용
gray: {
  50: '#f9fafb',   // 배경
  100: '#f3f4f6',  // 카드 배경
  200: '#e5e7eb',  // 구분선
  300: '#d1d5db',  // 비활성 요소
  400: '#9ca3af',  // 보조 텍스트
  500: '#6b7280',  // 일반 텍스트
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',  // 진한 텍스트
  900: '#111827',  // 헤더, 타이틀
}
```

### Status Colors (상태 색상)

```js
status: {
  todo: '#3b82f6',      // 파랑 (할일)
  inProgress: '#f59e0b', // 주황 (진행중)
  completed: '#10b981',  // 초록 (완료)
  overdue: '#ef4444',    // 빨강 (기한초과)
}
```

### Event Priority Colors (이벤트 우선순위)

```js
priority: {
  low: {
    bg: 'bg-blue-50',
    border: 'border-l-4 border-blue-400',
    text: 'text-blue-700',
  },
  medium: {
    bg: 'bg-orange-50',
    border: 'border-l-4 border-orange-400',
    text: 'text-orange-700',
  },
  high: {
    bg: 'bg-red-50',
    border: 'border-l-4 border-red-500',
    text: 'text-red-700',
  },
}
```

## 2. 타이포그래피 (Typography)

### Font Family

```js
fontFamily: {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
}
```

### Font Sizes

```js
fontSize: {
  'xs': '0.75rem',    // 12px - 보조 정보
  'sm': '0.875rem',   // 14px - 일반 텍스트
  'base': '1rem',     // 16px - 기본 텍스트
  'lg': '1.125rem',   // 18px - 서브 헤더
  'xl': '1.25rem',    // 20px - 헤더
  '2xl': '1.5rem',    // 24px - 큰 헤더
  '3xl': '1.875rem',  // 30px - 페이지 타이틀
}
```

### Text Styles

- **페이지 타이틀**: `text-3xl font-bold text-gray-900`
- **섹션 헤더**: `text-xl font-semibold text-gray-900`
- **할일 제목**: `text-base font-medium text-gray-800`
- **시간 표시**: `text-sm text-gray-500`
- **보조 정보**: `text-xs text-gray-400`

## 3. 레이아웃 (Layout)

### Container

```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Spacing System

```js
// 주요 간격 패턴
spacing: {
  '0': '0',
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  '3': '0.75rem',  // 12px
  '4': '1rem',     // 16px
  '5': '1.25rem',  // 20px
  '6': '1.5rem',   // 24px
  '8': '2rem',     // 32px
  '10': '2.5rem',  // 40px
  '12': '3rem',    // 48px
}
```

### Grid & Flexbox 패턴

```css
/* 사이드바 + 메인 레이아웃 */
.layout-container {
  @apply flex h-screen bg-gray-50;
}

.sidebar {
  @apply w-64 bg-white border-r border-gray-200;
}

.main-content {
  @apply flex-1 overflow-y-auto;
}

/* 캘린더 그리드 */
.calendar-grid {
  @apply grid grid-cols-7 gap-px bg-gray-200;
}
```

## 4. 컴포넌트 스타일 가이드

### 4.1 Buttons

#### Primary Button

```jsx
<button
  className="
  px-4 py-2
  bg-primary-500 hover:bg-primary-600
  text-white font-medium
  rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
"
>
  Add Task
</button>
```

#### Secondary Button

```jsx
<button
  className="
  px-4 py-2
  bg-white hover:bg-gray-50
  text-gray-700 font-medium
  border border-gray-300
  rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
"
>
  Cancel
</button>
```

#### Icon Button

```jsx
<button
  className="
  p-2
  text-gray-500 hover:text-gray-700 hover:bg-gray-100
  rounded-lg
  transition-colors duration-200
"
>
  <IconComponent className="w-5 h-5" />
</button>
```

#### Floating Action Button (FAB)

```jsx
<button
  className="
  fixed bottom-6 right-6
  w-14 h-14
  bg-primary-500 hover:bg-primary-600
  text-white
  rounded-full
  shadow-lg hover:shadow-xl
  flex items-center justify-center
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
"
>
  <PlusIcon className="w-6 h-6" />
</button>
```

### 4.2 Cards

#### Todo Card

```jsx
<div
  className="
  p-4
  bg-white
  border border-gray-200
  rounded-lg
  shadow-sm hover:shadow-md
  transition-shadow duration-200
"
>
  {/* 내용 */}
</div>
```

#### Event Card (캘린더)

```jsx
{
  /* Low Priority */
}
<div
  className="
  p-2
  bg-blue-50
  border-l-4 border-blue-400
  rounded
  text-sm
"
>
  <p className="font-medium text-blue-900">Event Title</p>
  <p className="text-xs text-blue-600">10:00-11:00</p>
</div>;

{
  /* Medium Priority */
}
<div
  className="
  p-2
  bg-orange-50
  border-l-4 border-orange-400
  rounded
  text-sm
"
>
  <p className="font-medium text-orange-900">Event Title</p>
  <p className="text-xs text-orange-600">09:00-10:00</p>
</div>;

{
  /* High Priority */
}
<div
  className="
  p-2
  bg-red-50
  border-l-4 border-red-500
  rounded
  text-sm
"
>
  <p className="font-medium text-red-900">Event Title</p>
  <p className="text-xs text-red-600">11:00-14:30</p>
</div>;
```

### 4.3 Sidebar

```jsx
<aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
  {/* User Profile */}
  <div className="p-4 border-b border-gray-200">
    <button className="flex items-center space-x-3 w-full hover:bg-gray-50 rounded-lg p-2">
      <img src="avatar.jpg" className="w-8 h-8 rounded-full" />
      <span className="font-medium text-gray-900">Username</span>
    </button>
  </div>

  {/* Navigation */}
  <nav className="flex-1 overflow-y-auto p-4 space-y-1">
    {/* Active Item */}
    <a
      href="#"
      className="
      flex items-center space-x-3
      px-3 py-2
      bg-primary-50 text-primary-700
      rounded-lg
      font-medium
    "
    >
      <IconComponent className="w-5 h-5" />
      <span>Upcoming</span>
    </a>

    {/* Inactive Item */}
    <a
      href="#"
      className="
      flex items-center space-x-3
      px-3 py-2
      text-gray-700 hover:bg-gray-100
      rounded-lg
      transition-colors duration-150
    "
    >
      <IconComponent className="w-5 h-5" />
      <span>Today</span>
    </a>
  </nav>

  {/* Favorites Section */}
  <div className="p-4 border-t border-gray-200">
    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
      Favorites
    </h3>
    <div className="space-y-1">
      <a
        href="#"
        className="
        flex items-center space-x-2
        px-2 py-1.5
        text-sm text-gray-700 hover:bg-gray-100
        rounded
        transition-colors duration-150
      "
      >
        <span className="text-gray-400">#</span>
        <span>Project Name</span>
      </a>
    </div>
  </div>
</aside>
```

### 4.4 Calendar Components

#### Calendar Header

```jsx
<div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
  <h2 className="text-2xl font-bold text-gray-900">Upcoming</h2>
  <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2">
      <button className="p-2 hover:bg-gray-100 rounded">
        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
      </button>
      <span className="text-sm font-medium text-gray-700">Today</span>
      <button className="p-2 hover:bg-gray-100 rounded">
        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
      </button>
    </div>
    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
      Plan
    </button>
  </div>
</div>
```

#### Calendar Grid

```jsx
<div className="grid grid-cols-7 gap-px bg-gray-200">
  {/* Day Column */}
  <div className="bg-white">
    {/* Day Header */}
    <div className="sticky top-0 p-3 bg-white border-b border-gray-200">
      <p className="text-xs font-medium text-gray-500">Mon</p>
      <p className="text-2xl font-semibold text-gray-900">10</p>
    </div>

    {/* Time Slots */}
    <div className="p-2 space-y-2">
      {/* Event */}
      <div className="text-sm">
        <p className="text-gray-500 text-xs mb-1">09:00</p>
        {/* Event Cards */}
      </div>
    </div>
  </div>
</div>
```

#### Time Grid (세로형 시간표)

```jsx
<div className="flex">
  {/* Time Labels */}
  <div className="w-16 border-r border-gray-200">
    <div className="h-12 border-b border-gray-100 flex items-center justify-end pr-2">
      <span className="text-xs text-gray-500">09:00</span>
    </div>
    <div className="h-12 border-b border-gray-100 flex items-center justify-end pr-2">
      <span className="text-xs text-gray-500">10:00</span>
    </div>
  </div>

  {/* Event Area */}
  <div className="flex-1 relative">
    {/* Grid Lines */}
    <div className="absolute inset-0">
      <div className="h-12 border-b border-gray-100"></div>
      <div className="h-12 border-b border-gray-100"></div>
    </div>

    {/* Events */}
    <div className="relative">
      {/* Event positioned absolutely based on time */}
      <div
        className="absolute left-2 right-2 bg-blue-50 border-l-4 border-blue-400 rounded p-2"
        style={{ top: "0px", height: "48px" }}
      >
        <p className="text-sm font-medium text-blue-900">Event</p>
        <p className="text-xs text-blue-600">10:00-11:00</p>
      </div>
    </div>
  </div>
</div>
```

### 4.5 Forms & Inputs

#### Text Input

```jsx
<input
  type="text"
  className="
    w-full px-4 py-2
    border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    placeholder:text-gray-400
  "
  placeholder="Enter task title..."
/>
```

#### Checkbox (할일 체크박스)

```jsx
<label className="flex items-center space-x-3 cursor-pointer group">
  <input
    type="checkbox"
    className="
      w-5 h-5
      text-primary-500
      border-gray-300 rounded
      focus:ring-2 focus:ring-primary-500
    "
  />
  <span className="text-gray-700 group-hover:text-gray-900">Task title</span>
</label>
```

#### Select / Dropdown

```jsx
<select
  className="
  px-4 py-2
  border border-gray-300 rounded-lg
  bg-white
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
"
>
  <option>Low Priority</option>
  <option>Medium Priority</option>
  <option>High Priority</option>
</select>
```

### 4.6 Badges & Tags

#### Status Badge

```jsx
{
  /* Active */
}
<span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
  Active
</span>;

{
  /* Completed */
}
<span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
  Completed
</span>;

{
  /* Overdue */
}
<span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
  Overdue
</span>;
```

#### Date Badge (today 표시)

```jsx
<div className="inline-flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full">
  <span className="text-sm font-semibold">12</span>
</div>
```

### 4.7 Mobile View

#### Mobile Header

```jsx
<header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
  <div className="flex items-center justify-between">
    <button className="p-2 -ml-2 text-gray-600">
      <MenuIcon className="w-6 h-6" />
    </button>
    <h1 className="text-lg font-semibold text-gray-900">Upcoming</h1>
    <button className="p-2 -mr-2 text-gray-600">
      <MoreIcon className="w-6 h-6" />
    </button>
  </div>
</header>
```

## 5. 반응형 디자인 (Responsive Design)

### Breakpoints

```js
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

### 반응형 패턴

```jsx
{
  /* 모바일: 숨김, 데스크탑: 표시 */
}
<div className="hidden lg:block">
  <Sidebar />
</div>;

{
  /* 모바일: 전체 너비, 데스크탑: 고정 너비 */
}
<div className="w-full lg:w-64">{/* Content */}</div>;

{
  /* 모바일: 1열, 태블릿: 2열, 데스크탑: 3열 */
}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>;
```

## 6. 애니메이션 & 트랜지션

### Transition Utilities

```js
transition: {
  'none': 'transition-none',
  'all': 'transition-all duration-200 ease-in-out',
  'colors': 'transition-colors duration-200',
  'shadow': 'transition-shadow duration-200',
}
```

### 일반적인 트랜지션

```css
/* Hover 효과 */
.hover-lift {
  @apply transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg;
}

/* Fade in/out */
.fade-in {
  @apply transition-opacity duration-300 opacity-0;
}

.fade-in.active {
  @apply opacity-100;
}

/* Slide in from right */
.slide-in-right {
  @apply transform translate-x-full transition-transform duration-300;
}

.slide-in-right.active {
  @apply translate-x-0;
}
```

## 7. 다크 모드 (선택사항)

```jsx
{
  /* 다크 모드 지원 예시 */
}
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>;
```

## 8. 아이콘 시스템

### 권장 아이콘 라이브러리

- **Heroicons** (Tailwind와 완벽 호환)
- **Lucide React** (가볍고 모던)

### 아이콘 크기

```jsx
{
  /* 작은 아이콘 */
}
<Icon className="w-4 h-4" />;

{
  /* 일반 아이콘 */
}
<Icon className="w-5 h-5" />;

{
  /* 큰 아이콘 */
}
<Icon className="w-6 h-6" />;

{
  /* 버튼 내 아이콘 */
}
<button className="flex items-center space-x-2">
  <Icon className="w-5 h-5" />
  <span>Button Text</span>
</button>;
```

## 9. 그림자 (Shadows)

```js
boxShadow: {
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
}
```

### 사용 예시

- 카드: `shadow-sm hover:shadow-md`
- FAB: `shadow-lg hover:shadow-xl`
- 드롭다운: `shadow-lg`
- 모달: `shadow-xl`

## 10. 사용 팁

### 일관성 유지

1. 간격은 4px 단위 사용 (p-1, p-2, p-3...)
2. 둥근 모서리는 `rounded`, `rounded-lg` 위주 사용
3. 색상은 정의된 팔레트만 사용
4. 폰트 크기는 정의된 스케일 사용

### 접근성 (Accessibility)

1. 포커스 스타일 항상 포함: `focus:ring-2`
2. 적절한 색상 대비 유지
3. 의미있는 HTML 태그 사용
4. ARIA 속성 적절히 활용

### 성능 최적화

1. 불필요한 중복 클래스 제거
2. @apply 사용을 최소화 (Tailwind 권장사항)
3. PurgeCSS 설정으로 미사용 스타일 제거
