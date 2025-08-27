import conf from '../../config.json';

export const getTitle = (project: string) => {
	const hasProp = Object.prototype.hasOwnProperty.call(conf, project);
	if (hasProp) {
		return conf[project as keyof typeof conf];
	}
	return '';
};

export const projectsKeys = Object.keys(conf) as Array<keyof typeof conf>;
