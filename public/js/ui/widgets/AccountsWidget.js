/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
    /**
     * Устанавливает текущий элемент в свойство element
     * Регистрирует обработчики событий с помощью
     * AccountsWidget.registerEvents()
     * Вызывает AccountsWidget.update() для получения
     * списка счетов и последующего отображения
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * */
    constructor(element) {
        this.element = element;
        this.registerEvents();
        this.update();
    }

    /**
     * При нажатии на .create-account открывает окно
     * #modal-new-account для создания нового счёта
     * При нажатии на один из существующих счетов
     * (которые отображены в боковой колонке),
     * вызывает AccountsWidget.onSelectAccount()
     * */
    registerEvents() {
        const createAccount = document.querySelector('.create-account');
        createAccount.onclick = () => {
            const modal = App.getModal('createAccount');
            modal.open();
        }

        const item = document.querySelector(".accounts-panel");
        item.addEventListener("click", this.onSelectAccount);
    }

    /**
     * Метод доступен только авторизованным пользователям
     * (User.current()).
     * Если пользователь авторизован, необходимо
     * получить список счетов через Account.list(). При
     * успешном ответе необходимо очистить список ранее
     * отображённых счетов через AccountsWidget.clear().
     * Отображает список полученных счетов с помощью
     * метода renderItem()
     * */
    update() {
        let current = this.current();
        if (current) {
            Account.list(current, (err, response) => {
                if (response && response.success) {
                    this.clear();
                    this.renderItem(response.data);
                }
            });
        }
    }

    /**
     * Очищает список ранее отображённых счетов.
     * Для этого необходимо удалять все элементы .account
     * в боковой колонке
     * */
    clear() {
        const currentAccounts = Array.from(document.querySelectorAll('.account'));
        currentAccounts.forEach((item) => {
            item.remove();
        });
    }

    /**
     * Срабатывает в момент выбора счёта
     * Устанавливает текущему выбранному элементу счёта
     * класс .active. Удаляет ранее выбранному элементу
     * счёта класс .active.
     * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
     * */
    onSelectAccount(event) {
        let activeItems = Array.from(document.querySelectorAll('.active'));
        for (let item of activeItems) {
            item.classList.remove('active');
        }

        let element = event.target.closest('.account');
        element.classList.add('active');

        App.showPage('transactions', {account_id: element.dataset.id});
    }

    /**
     * Возвращает HTML-код счёта для последующего
     * отображения в боковой колонке.
     * item - объект с данными о счёте
     * */
    getAccountHTML(item) {
        return `
      <li class="account" data-id="${item.id}">
          <a href="#">
              <span>${item.name} / </span>
              <span>${item.sum}</span>
          </a>
      </li>
      `;
    }

    /**
     * Получает массив с информацией о счетах.
     * Отображает полученный с помощью метода
     * AccountsWidget.getAccountHTML HTML-код элемента
     * и добавляет его внутрь элемента виджета
     * */
    renderItem(data) {
        data.forEach((item) => {
            this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(item));
        });

        let currentAccounts = Array.from(this.element.getElementsByClassName('account'));
        currentAccounts.forEach((item) => {
            item.addEventListener('click', this.onSelectAccount);
        });
    }
}
