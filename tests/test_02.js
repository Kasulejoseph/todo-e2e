const {
  setupFixture,
  setTestContext,
  wrapTest,
} = require("./utilities/todo_utils");
const { Selector } = require("testcafe");
setupFixture();

const meta = {
  id: "28707161-d2f8-42ad-874b-57d06f50f866",
  steps: [
    "Open home page",
    "Click the category select button",
    "Select a category",
    "ASSERTION: Number of todos reduce after a filter",
    "Click the checkbox",
    "ASSERTION: checkbox clicked and todo status changed"
  ],
};

wrapTest(meta)("select todo category and change todo status", async (t) => {
  const { getLocation } = setTestContext(t);
  const todoList = Selector(".list-group > .list-group-item")
  const todoListCount = await todoList.count;
  await t
    .expect(getLocation())
    .match(/.*\//)
    .click(Selector("select[name='todoCategory']"))
    .click(Selector("select > option").withText("Sports"))
  const newTodoListCount = await Selector(".list-group > .list-group-item").count
  await t
    .expect(newTodoListCount).lt(todoListCount);
  const checkBox = Selector("input[type='checkbox']")
  const todoStatus = await checkBox.nth(0).value
  const isChecked = await checkBox.nth(0).checked
  if (isChecked) {
    await t
      .expect(checkBox.nth(0).value).eql(todoStatus)
      .click(checkBox.nth(0))
      .expect(checkBox.nth(0).value).eql("pending")
  } else {
    await t
      .expect(checkBox.nth(0).value).eql("pending")
      .click(checkBox.nth(0))
      // .expect(await checkBox.nth(0).value).eql("completed")
  }
});
