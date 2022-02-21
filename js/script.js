"use strict";

import { $DATA } from "./data.js";
import { reply, Time } from "./event.js";
import { createUserComment, createNestedComment } from "./template.js";

/**
 * Basically a check to switch between currentUser template and the other users'
 * template by marking isCurrentUser as either {true} or {false}
 **/

export let isCurrentUser = false;

(function () {
  const buildTemplate = () => {
    const mainUl = document.querySelector(".comment__container");
    let func;

    $DATA.comments.forEach((comment) => {
      let li, div;
      let user__name = $DATA.currentUser.username;

      if (comment.user.username === user__name) {
        isCurrentUser = true;
        li = createUserComment.call(comment);
      } else {
        isCurrentUser = false;
        li = createUserComment.call(comment);
        div = createNestedComment.call(comment);
      }

      if (comment.replies && comment.replies.length) {
        comment.replies.forEach((reply) => {
          func = () => {
            const eLi = createUserComment.call(reply);
            const ul = div.firstElementChild;
            ul.append(eLi);
          };

          isCurrentUser
            ? (func(), (isCurrentUser = false))
            : (func(), (isCurrentUser = true));
        });
      }

      if (div) li.append(div);
      mainUl.append(li);
    });
  };

  buildTemplate();

  isCurrentUser = true;
})();

const newId = () => {
  let id;
  const ids = [];

  $DATA.comments.forEach((comment) => {
    ids.push(comment.id);
    if (comment.replies && comment.replies.length) {
      comment.replies.forEach((item) => ids.push(item.id));
    }
  });

  id = Math.max(...ids) + 1;

  return id;
};

class User {
  constructor(username, { ...imgSrc }) {
    this.id = newId();
    this.content = "";
    this.createdAt = "";
    this.user = {
      image: imgSrc,
      username: username,
    };

    this.replies = [];
    this.score = 0;
    Object.defineProperty(this, "active", {
      enumerable: false,
      writable: true,
      value: true,
    });
  }
}

export class CurrentUser extends User {
  constructor(username, { ...imgSrc }) {
    super(username, { ...imgSrc });
    Object.defineProperty(this, Symbol.toStringTag, {
      enumerable: false,
      value: "Current User",
    });
  }
}

/**
 * Retrieves the last state of a comment time before the window or tab closed
 * from the browser local storage
 */
function retrieveTime() {
  return new Promise((resolve, reject) => {
    const getter = async () => {
      const data = JSON.parse(localStorage.getItem("storage"));
      if (data) {
        return data.time;
      }
      throw new Error("Item doesn't exist in your browser Local Storage");
    };

    getter()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Gets the time array that contains the time of each user comment saved in browser
 * Local Storage from retrieveTime function and uses the object contained
 * in the array as a reference to each user and appropriately set the
 * currentTime property of a specific user object to the time
 * defined for that user.
 * @param {object} comment of each user
 */
function setUserTime(user) {
  retrieveTime().then((data) => {
    data.forEach((obj) => {
      if (obj.id == user.id) {
        new Time(user, obj);
        deleteTimeRunner(user.id);
        const t = time;
        t.push([updateTime.bind(this), this.id]);
      }
    });
  });
}

export class TimeInfo {
  constructor() {
    this.id = null;
    const properties = "seconds_minute_hour_day_month_year".split("_");
    const value = {
      value: null,
      enumerable: false,
      writable: true,
    };
    properties.forEach((key) => {
      Object.defineProperty(this, key, value);
    });
  }
}
