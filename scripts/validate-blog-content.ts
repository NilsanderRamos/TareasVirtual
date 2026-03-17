import { blogPosts } from "../src/content/blog/posts";
import { validateBlogPosts } from "../src/lib/blog";

const results = validateBlogPosts(blogPosts);
const failingPosts = results.filter((result) => !result.publishReady);
const warningOnlyPosts = results.filter(
	(result) => result.publishReady && result.issues.some((issue) => issue.severity === "warning"),
);

for (const result of results) {
	const status = result.publishReady
		? result.issues.length > 0
			? "WARN"
			: "PASS"
		: "FAIL";

	console.log(
		`${status} ${result.postSlug} | score=${result.score} | words=${result.stats.wordCount} | tools=${result.stats.toolLinks} | posts=${result.stats.relatedPostLinks}`,
	);

	for (const issue of result.issues) {
		console.log(`  - ${issue.severity.toUpperCase()} ${issue.code}: ${issue.message}`);
	}
}

console.log("");
console.log(`Resumen: ${results.length} posts revisados.`);
console.log(`Con errores: ${failingPosts.length}.`);
console.log(`Solo advertencias: ${warningOnlyPosts.length}.`);

if (failingPosts.length > 0) {
	process.exitCode = 1;
}