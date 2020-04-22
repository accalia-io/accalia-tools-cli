module.exports = (toolbox) => {
  const { filesystem, template, print: { success, error } } = toolbox;

  async function isReactNative() {
    const package = await filesystem.read('package.json', 'json');

    if(!package) {
      return false;
    }

    return !!package.dependencies['react-native'];
  }

  async function createComponent(folder, name) {
    name = name.charAt(0).toUpperCase() + name.slice(1);

    if (!name) {
      error('Name must be specified');
      return
    }

    await template.generate({
      template: 'frontend/component.js.ejs',
      target: `${folder}/${name}/index.js`,
      props: { name },
    })

    const styleTemplate = (await isReactNative())
      ? 'frontend/styles-rn.js.ejs'
      : 'frontend/styles-react.js.ejs'

    await template.generate({
      template: styleTemplate,
      target: `${folder}/${name}/styles.js`,
    })

    success(`Generated ${folder}/${name}.`)
  }

  toolbox.createComponent = createComponent
};