import { BlogPost } from "@/types";

export interface BlogValidationIssue {
	severity: "error" | "warning";
	code: string;
	message: string;
}

export interface BlogValidationResult {
	postSlug: string;
	postTitle: string;
	publishReady: boolean;
	score: number;
	issues: BlogValidationIssue[];
	stats: ReturnType<typeof getBlogPostStandardsSnapshot>;
}

const emojiPattern =
	/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

function getTextBlocks(post: BlogPost) {
	return [
		post.title,
		post.description,
		post.imageAlt,
		...(post.externalReferences?.flatMap((reference) => [
			reference.title,
			reference.publisher,
			reference.description,
		]) ?? []),
		...(post.referenceImages?.flatMap((image) => [
			image.alt,
			image.caption,
			image.label,
		]) ?? []),
		...(post.introduction ?? []),
		...(post.sections?.flatMap((section) => [section.heading, section.subheading ?? "", ...section.paragraphs]) ?? []),
		...(post.content ?? []),
		...(post.conclusion ?? []),
		...(post.keyTakeaways ?? []),
		...(post.faq?.flatMap((item) => [item.question, item.answer]) ?? []),
		...(post.comparisonTable?.flatMap((item) => [item.name, item.price, item.verdict, ...item.keyFeatures]) ?? []),
	]
		.map((value) => value.trim())
		.filter(Boolean);
}

function usesEmoji(post: BlogPost) {
	return getTextBlocks(post).some((block) => emojiPattern.test(block));
}

function isBestArticle(post: BlogPost) {
	return /^mejor(?:es)?\b/i.test(post.title.trim());
}

function addIssue(
	issues: BlogValidationIssue[],
	severity: BlogValidationIssue["severity"],
	code: string,
	message: string,
) {
	issues.push({ severity, code, message });
}

export function getBlogPostMeta(post: BlogPost) {
	const keywords = post.seo
		? [post.seo.primaryKeyword, ...post.seo.secondaryKeywords]
		: post.tags;

	return {
		title: post.seo?.metaTitle ?? post.title,
		description: post.seo?.metaDescription ?? post.description,
		keywords,
	};
}

export function estimateBlogPostWordCount(post: BlogPost) {
	const textBlocks = [
		...(post.introduction ?? []),
		...(post.sections?.flatMap((section) => section.paragraphs) ?? []),
		...(post.content ?? []),
		...(post.conclusion ?? []),
		...(post.keyTakeaways ?? []),
		...(post.faq?.flatMap((item) => [item.question, item.answer]) ?? []),
		...(post.comparisonTable?.flatMap((item) => [
			item.name,
			item.price,
			item.verdict,
			...item.keyFeatures,
		]) ?? []),
	];

	return textBlocks
		.join(" ")
		.trim()
		.split(/\s+/)
		.filter(Boolean).length;
}

export function getBlogPostStandardsSnapshot(post: BlogPost) {
	const toolLinks =
		post.internalLinks?.filter((link) => link.type === "tool").length ?? 0;
	const relatedPostLinks =
		post.internalLinks?.filter((link) => link.type === "post").length ?? 0;
	const externalReferences = post.externalReferences?.length ?? 0;
	const referenceImages = post.referenceImages?.length ?? 0;

	return {
		wordCount: estimateBlogPostWordCount(post),
		hasComparisonTable: Boolean(post.comparisonTable?.length),
		toolLinks,
		relatedPostLinks,
		externalReferences,
		referenceImages,
	};
}

export function validateBlogPost(post: BlogPost): BlogValidationResult {
	const issues: BlogValidationIssue[] = [];
	const standards = post.standards;
	const stats = getBlogPostStandardsSnapshot(post);
	const minWords = standards?.minWords ?? 2000;
	const maxWords = standards?.maxWords;
	const minToolLinks = standards?.minToolLinks ?? 2;
	const minRelatedPostLinks = standards?.minRelatedPostLinks ?? 2;
	const minExternalReferences = 2;
	const minReferenceImages = 2;
	const minFaqItems = 3;
	const minKeyTakeaways = 3;

	if (!post.seo) {
		addIssue(issues, "error", "missing-seo", "Faltan los metadatos SEO del post.");
	} else {
		if (!post.seo.metaTitle.trim()) {
			addIssue(issues, "error", "missing-meta-title", "Falta el meta title.");
		}

		if (post.seo.metaTitle.length > 60) {
			addIssue(issues, "error", "meta-title-length", "El meta title supera los 60 caracteres.");
		}

		if (!post.seo.metaDescription.trim()) {
			addIssue(issues, "error", "missing-meta-description", "Falta la meta description.");
		}

		if (post.seo.metaDescription.length > 155) {
			addIssue(
				issues,
				"error",
				"meta-description-length",
				"La meta description supera los 155 caracteres.",
			);
		}

		if (!post.seo.primaryKeyword.trim()) {
			addIssue(issues, "error", "missing-primary-keyword", "Falta la keyword principal.");
		}

		if (post.seo.secondaryKeywords.length < 2) {
			addIssue(
				issues,
				"warning",
				"few-secondary-keywords",
				"El post tiene menos de 2 keywords secundarias.",
			);
		}
	}

	if (!post.imageAlt.trim()) {
		addIssue(issues, "error", "missing-image-alt", "Falta el texto alternativo de la imagen.");
	}

	if ((post.introduction?.length ?? 0) < 2) {
		addIssue(
			issues,
			"error",
			"short-introduction",
			"La introduccion debe tener al menos 2 parrafos.",
		);
	}

	if ((post.sections?.length ?? 0) < 3 && (post.content?.length ?? 0) === 0) {
		addIssue(
			issues,
			"error",
			"missing-structure",
			"El post necesita una estructura clara con varias secciones.",
		);
	}

	if (stats.wordCount < minWords) {
		addIssue(
			issues,
			"error",
			"word-count",
			`El post tiene ${stats.wordCount} palabras y necesita al menos ${minWords}.`,
		);
	}

	if (maxWords && stats.wordCount > maxWords) {
		addIssue(
			issues,
			"warning",
			"word-count-too-long",
			`El post tiene ${stats.wordCount} palabras. Para este tipo de articulo conviene mantenerlo por debajo de ${maxWords} o dividirlo en piezas mas concretas.`,
		);
	}

	if (stats.toolLinks < minToolLinks) {
		addIssue(
			issues,
			"error",
			"tool-links",
			`El post tiene ${stats.toolLinks} enlaces a herramientas y necesita al menos ${minToolLinks}.`,
		);
	}

	if (stats.relatedPostLinks < minRelatedPostLinks) {
		addIssue(
			issues,
			"error",
			"related-links",
			`El post tiene ${stats.relatedPostLinks} enlaces a otros posts y necesita al menos ${minRelatedPostLinks}.`,
		);
	}

	if (stats.externalReferences < minExternalReferences) {
		addIssue(
			issues,
			"error",
			"external-references",
			`El post tiene ${stats.externalReferences} referencias externas y necesita al menos ${minExternalReferences}.`,
		);
	}

	if (stats.referenceImages < minReferenceImages) {
		addIssue(
			issues,
			"error",
			"reference-images",
			`El post tiene ${stats.referenceImages} imagenes de referencia y necesita al menos ${minReferenceImages}.`,
		);
	}

	if (isBestArticle(post) && (post.comparisonTable?.length ?? 0) < 5) {
		addIssue(
			issues,
			"error",
			"comparison-table",
			"Los articulos de tipo 'Mejor/Mejores' deben incluir una tabla comparativa con al menos 5 opciones.",
		);
	}

	if (!post.cta) {
		addIssue(issues, "error", "missing-cta", "Falta la llamada a la accion final.");
	}

	if ((post.faq?.length ?? 0) < minFaqItems) {
		addIssue(
			issues,
			"warning",
			"faq-depth",
			`El post tiene menos de ${minFaqItems} preguntas frecuentes.`,
		);
	}

	if ((post.keyTakeaways?.length ?? 0) < minKeyTakeaways) {
		addIssue(
			issues,
			"warning",
			"few-key-takeaways",
			`El post tiene menos de ${minKeyTakeaways} puntos clave.`,
		);
	}

	if (post.tags.length < 3) {
		addIssue(issues, "warning", "few-tags", "El post tiene menos de 3 tags.");
	}

	if (standards?.noEmojis && usesEmoji(post)) {
		addIssue(issues, "error", "emoji-detected", "Se detectaron emojis en el contenido del post.");
	}

	if (standards?.updatedForYear && !post.date.startsWith(String(standards.updatedForYear))) {
		addIssue(
			issues,
			"warning",
			"stale-date",
			`La fecha del post no coincide con el ano objetivo ${standards.updatedForYear}.`,
		);
	}

	const errorCount = issues.filter((issue) => issue.severity === "error").length;
	const warningCount = issues.length - errorCount;
	const score = Math.max(0, 100 - errorCount * 12 - warningCount * 4);

	return {
		postSlug: post.slug,
		postTitle: post.title,
		publishReady: errorCount === 0,
		score,
		issues,
		stats,
	};
}

export function validateBlogPosts(posts: BlogPost[]) {
	return posts.map((post) => validateBlogPost(post));
}
