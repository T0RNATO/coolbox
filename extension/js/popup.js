const popup = document.createElement("div");
popup.classList.add("popup");
popup.innerHTML = /*html*/`
    <div class="popup-title">
        <h1><strong>Create Reminder</strong></h1>
    </div>
    <div class="popup-body">
        Name:
        <input placeholder="Reminder Name" id="rem-name" maxlength="128">
        Time:
        <input placeholder="Time" id="rem-time">
        Notification Method:<br>
        <input type="radio" id="system" value="desktop" class="plain popup-radio" name="notif-method">
        <label for="system" class="popup-label button">System Notification</label>

        <input type="radio" id="discord" value="discord" class="plain popup-radio" name="notif-method">
        <label for="discord" class="popup-label button">Discord Ping</label>

        <input type="radio" id="both" value="both" class="plain popup-radio" name="notif-method">
        <label for="both" class="popup-label button">Both</label>

        <br><br>
        <span title="Ticking this will show the reminder as an assessment-specific reminder rather than a generic reminder">Associate with Asssessment:</span>
        <input type="checkbox" id="link-assessment" class="plain">
        <div class="popup-buttons">
            <button class="submit popup-button" id="create-reminder">Create Reminder</button>
            <button class="popup-button" id="cancel-popup">Cancel</button>
        </div>
    </div>
`

document.body.appendChild(popup);
popup.addEventListener("click", (e) => {e.stopPropagation()});

function openPopup(ev) {
    // Prevent popup from instantly closing
    ev.stopPropagation();

    // Set default input values
    popup.querySelector("#rem-name").value = ev.target.parentElement.querySelector("h3").innerText;
    popup.querySelector("#link-assessment").checked = "true";

    let time = ev.target.parentElement.querySelector("span").title;
    time = time.replace("am", "AM").replace("pm", "PM");

    // Automatically select the time of the due work item
    timePicker.setDate(time, false, "l F J Y h:iK");
    popup.classList.add("display");
}

function closePopup() {
    document.querySelector(".popup").classList.remove("display");
    popup.querySelector("#rem-name").value = "";
    popup.querySelector("#link-assessment").checked = "false";
}
let timePicker;

window.addEventListener("load", () => {
    timePicker = flatpickr("#rem-time", {dateFormat: "l F J Y h:iK", enableTime: true, minDate: new Date()});
    timePicker.calendarContainer.addEventListener("click", (ev) => {
        ev.stopPropagation();
    })
})

document.querySelector("#cancel-popup").addEventListener("click", closePopup);
document.querySelector("#create-reminder").addEventListener("click", () => {
    const title = document.querySelector("#rem-name").value;
    const time = timePicker.selectedDates[0].getTime();
    const method = document.querySelector(".popup-radio:checked").value;

    

    const data = {
        title: title,
        due: time,
        method: method,
        assessment: null
    }

    const headers = new Headers({
        "Authorization": "Bearer " + cookie,
        "Content-Type": "application/json"
    })

    fetch("https://api.coolbox.lol/reminders", {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers
    }).then((response) => {
        if (response.ok && response.status === 200) {
            alert("Reminder Successfully Made")
        } else {
            alert("Reminder Creation Failed")
        }
    })
});
document.body.addEventListener("click", closePopup);

for (const dueWorkItem of document.querySelectorAll("#component52396 .card")) {
    const reminderButton = document.createElement("div");
    reminderButton.classList.add("reminder-button");
    reminderButton.addEventListener("click", (ev) => {openPopup(ev)})
    dueWorkItem.appendChild(reminderButton);
}

document.head.innerHTML += /*html*/`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
`