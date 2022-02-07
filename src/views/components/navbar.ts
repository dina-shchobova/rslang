export const Navbar = async (): Promise<string> => {
  const view = `<div class="header-container">
    <nav class="nav-bar">
      <a href="#" class="home">Главная</a>
      <a href="#/text-book" class="text-book">Учебник</a>
      <a href="#/games" class="">Игры</a>
      <a href="#/winners" class="winners">Статистика</a>
    </nav>
  </div>`;
  return view;
};
