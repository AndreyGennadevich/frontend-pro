let contactData = [];
let tableHeading = document.querySelectorAll('th');

function renderTable(itemList) {
    let content = '';
    for (let obj of itemList) {
        let contacts = '';
        let hiddenClass = '';
        let btnExpansionContact = '';
        let createdAtDate = new Date(obj.createdAt);
        let updateAtDate = new Date(obj.updatedAt);

        const limitContacts = 4;
        for (j = 0; j < obj.contacts.length; j++) {
            if (j >= limitContacts) {
                hiddenClass = "hidden-class";
                btnExpansionContact = `<button class="social__expansion" onclick="disableHidden(event)">+${((obj.contacts.length) - limitContacts)}</button>`
            }
            let objContacts = obj.contacts[j];
            if (objContacts.type === 'Телефон') {
                contacts = contacts + `<span class="social__img social__img-phone tooltip ${hiddenClass}">
                <a href="${objContacts.value}" class="social__link social__link-phone phone">${objContacts.value}</a>
                </span>`
            }
            if (objContacts.type === 'Email') {
                contacts = contacts + `<span class="social__img social__img-mail  tooltip  ${hiddenClass}">
                <a href="${objContacts.value}" class="social__link social__link-mail email" >${objContacts.value}</a>
                </span>`
            }
            if (objContacts.type === 'Facebook') {
                contacts = contacts + `<span class="social__img social__img-fb tooltip ${hiddenClass}">
                <a href="${objContacts.value}" class="social__link social__link-fb facebook">${objContacts.value}</a>
                </span>`
            }
            if (objContacts.type === 'Vk') {
                contacts = contacts + `<span class="social__img social__img-vk tooltip ${hiddenClass}">
                <a href="${objContacts.value}" class="social__link social__link-vk vk">${objContacts.value}"</a>
                </span>`
            }
            if (objContacts.type === "Доп.контакты") {
                contacts = contacts + `<span class="social__img social__img-other tooltip ${hiddenClass}">
                <a href="${objContacts.value}" class="social__link social__link-other other">${objContacts.value}</a>
                </span>`
            }

        }

        const optionsTime = {
            hour: 'numeric',
            minute: 'numeric'
        };

        const optionsDate = {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        };

        content = content + `<tr class="table__row">
        <td class="table__row-id">${obj.id}</td>
        <td class="table__row-fullname">${obj.surname} ${obj.name} ${obj.lastName}</td>
        <td class="table__row-create">${createdAtDate.toLocaleString('ru',optionsDate)}
            <span class="time__create-client">${createdAtDate.toLocaleString("ru", optionsTime)}</span>
        </td>
        <td class="table__row-change">${updateAtDate.toLocaleString("ru", optionsDate)}
            <span class="time__change-client">${updateAtDate.toLocaleString("ru", optionsTime)}</span>
        </td>
        <td class="table__row-socail">
            <div class="social__wrap">
                ${contacts}
                ${btnExpansionContact}
            </div>      
        </td>
        <td><div class="btn-wrap"><button class="btn__change" onclick="changeClient(${obj.id})">Изменить</button><button class="btn__delete" onclick="deleteClient(event)">Удалить</button></div></td>
    </tr>`
    }

    let table = document.querySelector('tbody');
    table.innerHTML = content;
}

const selectToggle = function () {
    debugger
    this.parentElement.classList.toggle('is-active');
};

function select() {
    let selectHeader = document.querySelectorAll('.select__header');
    let selectItem = document.querySelectorAll('.select__item');


    selectItem.forEach(item => {
        item.addEventListener('click', selectChoice);
    });

    selectHeader.forEach(item => {
        item.removeEventListener('click', selectToggle);
        item.addEventListener('click', selectToggle);
    });



    function selectChoice() {
        let text = this;
        let select = this.closest('.select');
        let item = select.querySelector('.selected');
        let currentText = select.querySelector('.select__curent');
        removeClassSelected(item);
        currentText.innerText = text.innerText;
        select.setAttribute('data-key', `${this.dataset.key}`);
        text.classList.add('selected');
        select.classList.remove('is-active');
    };

    function removeClassSelected(item) {

        item.classList.remove('selected')
    };
};

function addClientModal() {
    const header = document.querySelector('.modal__create-header');
    const btnWrapper = document.querySelector('.modal__footer');
    let createModal = document.querySelector('.modal-wrapper');
    createModal.classList.add('modal-wrapper-active');
    header.innerHTML = `Новый клиент`;
    btnWrapper.children[2].innerHTML = 'Отмена';
    btnWrapper.children[2].setAttribute('onclick', `cancelModal()`);
    const btnSave = document.querySelector('.form__btn-save');
    btnSave.setAttribute("onclick", `handleAddClient()`)
}

function cancelModal() {
    let createModal = document.querySelector('.modal-wrapper');
    createModal.classList.remove('modal-wrapper-active');
    clearModal()
}

function sortMethod(array, param, reverse) {
    let sortReverse1 = 1;
    let sortReverse2 = -1;
    if (reverse) {
        sortReverse1 = -1;
        sortReverse2 = 1;
    }

    let sortForParam = function (a, b) {
        if ((a[param]) > (b[param])) {
            return sortReverse1;
        }
        if ((a[param]) < (b[param])) {
            return sortReverse2;
        }
        return 0;
    };

    function sort(array, func) {
        return array.sort(func)
    };

    let sortData = sort(array, sortForParam);
    return sortData;
}

function sortArrayValue(event) {
    searchActiveHeader(tableHeading)
    let thisHeader = event.target.closest('.table__head');
    thisHeader.classList.add('table__head-active');
    let revers = thisHeader.classList.contains('unrevers');
    thisHeader.classList.toggle('unrevers')
    let sortValue = event.target.closest('.table__head').dataset.header;
    let sortData = sortMethod(contactData, sortValue, revers)
    renderTable(sortData);
}


function searchActiveHeader(array) {
    for (let obj of array) {
        if (obj.classList.contains('table__head-active')) {
            obj.classList.remove('table__head-active')
        }
    }
}

function disableHidden(event) {
    let cell = event.target.closest('.social__wrap');
    cell.classList.add('social__wrap-active');
    event.target.style.display = 'none';
}

const maxContactslength = 10;

function addContactMenu(type, value) {
    let contactWrap = document.querySelector('.contact-wrapper');
    let contactMenu = document.querySelectorAll('.form__contact')
    let btnAdd = document.querySelector('.form__btn-addcontact');
    let wrap = document.querySelector('.form__btn-wrap');
    let typeForForm = "Телефон";
    let valueForForm = "";
    if (contactMenu.length < maxContactslength) {
        btnAdd.style.display = 'block';
    } else {
        btnAdd.style.display = 'none';
    };

    if (type) {
        typeForForm = type;
        valueForForm = value;
    }
    wrap.style.padding = "25px 30px";

    let form = document.createElement('div');
    form.classList.add('form__contact');
    form.innerHTML = `
            <div class="select" data-key=${typeForForm}>
                <div class="select__header">
                    <span class="select__curent">${typeForForm}</span>
                    <div class="select__icon">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.494999 0.690033C0.249999 0.935033 0.249999 1.33003 0.494999 1.57503L4.65 5.73003C4.845 5.92503 5.16 5.92503 5.355 5.73003L9.51 1.57503C9.755 1.33003 9.755 0.935032 9.51 0.690032C9.265 0.445032 8.87 0.445032 8.625 0.690032L5 4.31003L1.375 0.685034C1.135 0.445034 0.734999 0.445033 0.494999 0.690033Z"
                                fill="#9873FF" />
                        </svg>
                    </div>
                </div>

                <div class="select__body">
                    <div data-key="Телефон" class="select__item selected">Телефон</div>
                    <div data-key="Доп.контакты" class="select__item">Доп.контакт</div>
                    <div data-key="Email" class="select__item">Email</div>
                    <div data-key="Vk" class="select__item">Vk</div>
                    <div data-key="Facebook" class="select__item">Facebook</div>
                </div>
            </div>
            <input type="text" class="input__contact-info" value=${valueForForm}>
            <button class="btn__contact-delete tooltip" tooltip-data="Удалить контакт" onclick="deleteContact(event); return false;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
            </svg></button>`;
    contactWrap.append(form);
    select();
}

function deleteContact(event) {
    let contactMenu = event.target.closest('.form__contact');
    contactMenu.remove();
    let menuArray = document.querySelectorAll('.form__contact');
    if (menuArray.length <= 0) {
        clearPaddingModalContacts()
    }
}

function clearModal() {
    const contactMenu = document.querySelector('.contact-wrapper');
    const blockMeassage = document.querySelector('.modal__footer-message');
    const form = document.querySelector('form');
    clearPaddingModalContacts()
    contactMenu.innerHTML = '';
    blockMeassage.innerHTML = '';
    form.reset();
}


function deleteClient(event) {
    let tableRow = event.target.closest('tr');
    let modalDelete = document.querySelector('.modal-wrapper-delete');
    modalDelete.classList.add('modal-wrapper-active');
    let btnClose = document.querySelector('.delete__btn-close');
    let btnCancel = document.querySelector('.delete__btn-cancel');
    let btnDelete = document.querySelector('.delete__btn');
    btnClose.addEventListener('click', function () {
        modalDelete.classList.remove('modal-wrapper-active');
    });
    btnCancel.addEventListener('click', function () {
        modalDelete.classList.remove('modal-wrapper-active');
    });
    btnDelete.addEventListener('click', () => handleDeleting(tableRow.children[0].innerHTML));
}

function clearPaddingModalContacts() {
    let wrap = document.querySelector('.form__btn-wrap');
    wrap.style.padding = "9px 30px";
}

function changeClient(id) {
    const header = document.querySelector('.modal__create-header');
    const btnWrapper = document.querySelector('.modal__footer');
    let target = contactData.find(el => el.id === String(id));
    const contactWrap = document.querySelector('.modal-wrapper');
    contactWrap.classList.add('modal-wrapper-active');
    header.innerHTML = `Изменить данные <span class='modal__create-span'>ID:${id}</span>`;
    btnWrapper.children[2].innerHTML = 'Удалить клиента';
    btnWrapper.children[2].setAttribute('onclick', `handleDeleting(${id})`);
    const inputSurame = document.querySelector('.form__input-surname');
    const inputName = document.querySelector('.form__input-name');
    const inputLastName = document.querySelector('.form__input-lastname');
    const btnSave = document.querySelector('.form__btn-save');
    btnSave.setAttribute("onclick", `handleChangeClient(${id})`);
    clearPaddingModalContacts();

    inputSurame.value = target.surname;
    inputName.value = target.name;
    inputLastName.value = target.lastName;
    if (target.contacts.length > 0) {
        for (let obj of target.contacts) {
            addContactMenu(obj.type, obj.value)

        };
    }
    select();

};

const handleFetchResponse = response => {
    return new Promise((resolve, reject) => {
        if (response.status === 201 || response.status === 200) {
            resolve(response)
        } else {
            return response.json()
                .then((data) => {
                    reject(data)
                });

        }
    });
}


let timeout;

function enteringFiltr() {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
        getClient().then((data) => {
            renderTable(data);
        });
    }, 500);

}


function getClient() {
    let filterInput = document.querySelector('.header__search');

    let url = new URL(`http://localhost:3000/api/clients`);

    if (filterInput) {
        url.searchParams.set('search', filterInput.value);
    }
    let itemList = fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            contactData = data;

            return data;
        });

    return itemList
};

getClient().then((itemList) => renderTable(itemList));

async function addClient(data) {
    let url = new URL('http://localhost:3000/api/clients');
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'aplication/json'
        }
    });
};

function handleAddClient() {
    const inputSurame = document.querySelector('.form__input-surname');
    const inputName = document.querySelector('.form__input-name');
    const inputLastName = document.querySelector('.form__input-lastname');
    const contactMenu = document.querySelector('.contact-wrapper');
    let contacts = [];

    if (contactMenu.childElementCount >= 0) {
        let allContacts = document.querySelectorAll('.form__contact');
        for (let obj of allContacts) {
            let objInData = {};

            objInData.type = obj.children[0].dataset.key;
            objInData.value = obj.children[1].value;
            contacts.push(objInData);
        }
    };


    addClient({
            name: inputName.value,
            surname: inputSurame.value,
            lastName: inputLastName.value,
            contacts: contacts
        })
        .then(response => handleFetchResponse(response))
        .then(() => {
            getClient()
                .then((itemList) => {
                    clearModal()
                    cancelModal()
                    renderTable(itemList)
                })
        }).catch((error) => {
            let blockError = document.querySelector('.modal__footer-message');
            if (error.errors[0].message) {
                blockError.innerHTML = `Ошибка: ${error.errors[0].message}`
            } else {
                blockError.innerHTML = "Что-то пошло не так...";
            }
        });
}

async function deletClient(id) {
    let url = new URL(`http://localhost:3000/api/clients/${id}`)
    return await fetch(url, {
        method: 'DELETE'
    });
};

function handleDeleting(id) {
    deletClient(id)
        .then(response => handleFetchResponse(response))
        .then(() => {
            getClient().then((itemList) => {
                let modalDelete = document.querySelector('.modal-wrapper-delete');
                modalDelete.classList.remove('modal-wrapper-active');
                renderTable(itemList)
            })
        })
};

async function changeClientInData(id, data) {
    let url = new URL(`http://localhost:3000/api/clients/${id}`)
    return await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'aplication/json'
        }
    })
};

function handleChangeClient(id) {
    let inputSurame = document.querySelector('.form__input-surname');
    let inputName = document.querySelector('.form__input-name');
    let inputLastName = document.querySelector('.form__input-lastname');
    let contactMenu = document.querySelector('.contact-wrapper');
    let contacts = [];

    if (contactMenu.childElementCount >= 0) {
        let allContacts = document.querySelectorAll('.form__contact');
        for (let obj of allContacts) {
            let objInData = {};
            objInData.type = obj.children[0].dataset.key;
            objInData.value = obj.children[1].value;
            contacts.push(objInData);
        }
    }
    changeClientInData(id, {
            name: inputName.value,
            surname: inputSurame.value,
            lastName: inputLastName.value,
            contacts: contacts
        })
        .then(response => handleFetchResponse(response))
        .then(() => {
            getClient().then((itemList) => {
                clearModal()
                cancelModal()
                renderTable(itemList)
            })
        })
        .catch((error) => {
            let blockError = document.querySelector('.modal__footer-message');
            if (error.errors[0].message) {
                blockError.innerHTML = `Ошибка: ${error.errors[0].message}`
            } else {
                blockError.innerHTML = "Что-то пошло не так...";
            }
        });


};