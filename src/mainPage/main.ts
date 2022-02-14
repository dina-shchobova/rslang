const htmlCodeMainPage = `
  <div class="application-description">
    <div class="text-advantages">RSLang - отличное приложение для изучения новых слов.</div>
    <div class="title">Наши преимущества</div>
    <div class="advantages"></div>
  </div>
  <div class="title">Наша команда</div>
  <div class="our-team"></div>
`;

const textAdvantages = {
  locate: 'Всегда под рукой',
  play: 'Обучение в играх',
  hard: 'Отмечай сложные слова',
  progress: 'Отслеживай свой прогресс',
};

const ourTeam = {
  alexander: ['Alexivkov', 'Alexander Sivkov'],
  dina: ['dina-shchobova', 'Dzina Shchobava'],
  tatsiana: ['taleatg', 'Tatsiana Dashuk'],
};

export class Main {
  createMainPage(): void {
    const main = document.querySelector('main') as HTMLElement;
    main.innerHTML = htmlCodeMainPage;

    this.createAdvantages();
    this.createInfoAboutOurTeam();
  }

  createAdvantages = (): void => {
    const typeAdvantages = Object.entries(textAdvantages);

    typeAdvantages.forEach((item) => {
      const advantages = document.querySelector('.advantages') as HTMLElement;
      const advantage = document.createElement('div');
      const imgAdvantage = document.createElement('div');
      const titleAdvantage = document.createElement('div');

      advantage.classList.add('advantage');
      imgAdvantage.classList.add('img-advantages', item[0]);
      titleAdvantage.classList.add('title-advantages');
      titleAdvantage.innerHTML = `${item[1]}`;

      advantages.appendChild(advantage);
      advantage.append(imgAdvantage, titleAdvantage);
    });
  };

  createInfoAboutOurTeam = (): void => {
    const teamMemberInformation = Object.entries(ourTeam);

    teamMemberInformation.forEach((item) => {
      const team = document.querySelector('.our-team') as HTMLElement;
      const teamMember = document.createElement('div');
      const avatar = document.createElement('div');
      const title = document.createElement('div');
      const linkForGithub = document.createElement('a');
      const role = document.createElement('div');

      teamMember.classList.add('team-member');
      avatar.classList.add('avatar', item[0]);
      title.classList.add('title', 'link');
      linkForGithub.innerHTML = `${item[1][1]}`;
      linkForGithub.setAttribute('href', `https://github.com/${item[1][0]}`);
      linkForGithub.setAttribute('target', '_blank');

      team.appendChild(teamMember);
      teamMember.append(avatar, title, role);
      title.appendChild(linkForGithub);
    });
  };
}
