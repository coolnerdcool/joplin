import { time } from 'lib/time-utils.js';
import { setupDatabase, setupDatabaseAndSynchronizer, db, synchronizer, fileApi, sleep, clearDatabase, switchClient } from 'test-utils.js';
import { Folder } from 'lib/models/folder.js';
import { Note } from 'lib/models/note.js';
import { Setting } from 'lib/models/setting.js';
import { BaseItem } from 'lib/models/base-item.js';
import { BaseModel } from 'lib/base-model.js';

process.on('unhandledRejection', (reason, p) => {
	console.error('Unhandled promise rejection at: Promise', p, 'reason:', reason);
});

describe('BaseItem', function() {

	beforeEach( async (done) => {
		await setupDatabaseAndSynchronizer(1);
		switchClient(1);
		done();
	});

	it('should create a deleted_items record', async (done) => {
		let folder1 = await Folder.save({ title: 'folder1' });
		let folder2 = await Folder.save({ title: 'folder2' });

		await Folder.delete(folder1.id);

		let items = await BaseItem.deletedItems();

		expect(items.length).toBe(1);
		expect(items[0].item_id).toBe(folder1.id);
		expect(items[0].item_type).toBe(folder1.type_);

		let folders = await Folder.all();

		expect(folders.length).toBe(1);

		done();
	});

});