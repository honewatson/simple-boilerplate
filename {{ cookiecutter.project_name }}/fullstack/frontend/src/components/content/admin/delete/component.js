import { default as deleteComponent } from '../../../crud/delete/component';

import { default as componentConfig } from '../../config';

const ID = "main__content";

const component = deleteComponent(ID, componentConfig);

export default component;